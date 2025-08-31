import { z } from 'zod';

// Type definitions
export const PriceArgsSchema = z.object({
  propertyId: z.string(),
  unitTypeCode: z.string(),
  checkIn: z.string(), // ISO date
  checkOut: z.string(),
  guests: z.number().int().positive(),
  ratePlanCode: z.string().optional(),
  coupons: z.array(z.string()).optional(),
});

export type PriceArgs = z.infer<typeof PriceArgsSchema>;

export type NightlyRate = {
  date: string;
  baseRate: number;
  seasonalRate?: number;
  appliedRate: number;
  weekend: boolean;
  seasonName?: string;
};

export type PriceBreakdown = {
  nights: number;
  nightly: NightlyRate[];
  subtotal: number;
  taxes: {
    name: string;
    rate: number;
    amount: number;
  }[];
  fees: {
    name: string;
    amount: number;
  }[];
  discounts: {
    name: string;
    type: string;
    value: number;
    amount: number;
  }[];
};

export type PriceResult = {
  nights: number;
  nightly: NightlyRate[];
  subtotal: number;
  tax: number;
  fees: number;
  discount: number;
  total: number;
  breakdown: PriceBreakdown;
};

/**
 * Calculates the price for a reservation based on dates, unit type, and other factors
 * 
 * @param args - PriceArgs object containing all necessary data for pricing
 * @param dbClient - Database client for fetching rates, seasons, etc.
 * @returns Promise<PriceResult> with full pricing breakdown
 */
export async function priceReservation(
  args: PriceArgs,
  dbClient: any
): Promise<PriceResult> {
  // Validate arguments
  const validArgs = PriceArgsSchema.parse(args);
  
  // 1. Get required data from database
  const [property, unitType, ratePlans, seasons, coupons] = await Promise.all([
    dbClient.property.findUnique({
      where: { id: validArgs.propertyId },
      include: { settings: true },
    }),
    dbClient.unitType.findFirst({
      where: { 
        propertyId: validArgs.propertyId,
        code: validArgs.unitTypeCode,
      },
    }),
    dbClient.ratePlan.findMany({
      where: {
        propertyId: validArgs.propertyId,
        active: true,
      },
    }),
    dbClient.season.findMany({
      where: {
        propertyId: validArgs.propertyId,
        active: true,
      },
    }),
    validArgs.coupons?.length ? 
      dbClient.coupon.findMany({
        where: {
          propertyId: validArgs.propertyId,
          code: { in: validArgs.coupons },
          active: true,
        },
      }) : [],
  ]);
  
  if (!property || !unitType) {
    throw new Error('Property or unit type not found');
  }
  
  // 2. Determine rate plan to use
  const ratePlanCode = validArgs.ratePlanCode || 'STD'; // Default to standard rate plan if not specified
  const ratePlan = ratePlans.find((plan: any) => plan.code === ratePlanCode);
  
  if (!ratePlan) {
    throw new Error(`Rate plan ${ratePlanCode} not found`);
  }
  
  // 3. Generate array of nights
  const checkIn = new Date(validArgs.checkIn);
  const checkOut = new Date(validArgs.checkOut);
  
  if (checkIn >= checkOut) {
    throw new Error('Check-out must be after check-in');
  }
  
  const nights = calculateNights(checkIn, checkOut);
  const nightlyRates = calculateNightlyRates(checkIn, checkOut, unitType, ratePlan, seasons);
  
  // 4. Calculate subtotal (sum of nightly rates)
  const subtotal = nightlyRates.reduce((sum, night) => sum + night.appliedRate, 0);
  
  // 5. Calculate additional fees
  const extraGuestFee = calculateExtraGuestFee(unitType, validArgs.guests);
  const cleaningFee = unitType.cleaningFee;
  
  // 6. Calculate taxes
  const taxRate = property.settings.taxes[0]?.percentage || 18; // Default to 18% if not specified
  const taxAmount = Math.round((subtotal + extraGuestFee + cleaningFee) * (taxRate / 100));
  
  // 7. Apply coupons & calculate discounts
  const discountDetails = calculateDiscounts(subtotal, coupons);
  
  // 8. Calculate total
  const total = subtotal + extraGuestFee + cleaningFee + taxAmount - discountDetails.totalDiscount;
  
  // 9. Prepare result object with full breakdown
  const result: PriceResult = {
    nights: nights,
    nightly: nightlyRates,
    subtotal,
    tax: taxAmount,
    fees: extraGuestFee + cleaningFee,
    discount: discountDetails.totalDiscount,
    total,
    breakdown: {
      nights,
      nightly: nightlyRates,
      subtotal,
      taxes: [
        {
          name: property.settings.taxes[0]?.name || 'GST',
          rate: taxRate,
          amount: taxAmount,
        },
      ],
      fees: [
        {
          name: 'Extra Guest Fee',
          amount: extraGuestFee,
        },
        {
          name: 'Cleaning Fee',
          amount: cleaningFee,
        },
      ],
      discounts: discountDetails.discounts,
    },
  };
  
  return result;
}

// Helper functions
function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6; // Friday or Saturday
}

function calculateNightlyRates(
  checkIn: Date,
  checkOut: Date,
  unitType: any,
  ratePlan: any,
  seasons: any[]
): NightlyRate[] {
  const result: NightlyRate[] = [];
  const nights = calculateNights(checkIn, checkOut);
  
  // Base rate adjustment from rate plan (if specified)
  let baseRateAdjustment = 0;
  if (ratePlan.baseRate) {
    if (ratePlan.baseRate < 0) {
      // Negative value means percentage discount
      baseRateAdjustment = ratePlan.baseRate / 100;
    } else {
      // Positive value means fixed rate override
      baseRateAdjustment = ratePlan.baseRate - unitType.baseRate;
    }
  }
  
  // Loop through each night
  const currentDate = new Date(checkIn);
  for (let i = 0; i < nights; i++) {
    const isWeekendDay = isWeekend(currentDate);
    let baseRate = unitType.baseRate;
    
    // Apply base rate adjustment
    if (ratePlan.baseRate) {
      if (ratePlan.baseRate < 0) {
        // Percentage discount
        baseRate = Math.round(baseRate * (1 + baseRateAdjustment));
      } else {
        // Fixed rate
        baseRate = ratePlan.baseRate;
      }
    }
    
    // Check for seasonal rate
    let appliedRate = baseRate;
    let seasonName = undefined;
    
    for (const season of seasons) {
      const seasonStart = new Date(season.startDate);
      const seasonEnd = new Date(season.endDate);
      
      if (currentDate >= seasonStart && currentDate <= seasonEnd) {
        const seasonalRate = season.rates[unitType.id];
        if (seasonalRate) {
          appliedRate = seasonalRate;
          seasonName = season.name;
          break;
        }
      }
    }
    
    // Apply weekend uplift if applicable
    if (isWeekendDay && ratePlan.weekendUplift > 0) {
      appliedRate = Math.round(appliedRate * (1 + ratePlan.weekendUplift / 100));
    }
    
    result.push({
      date: currentDate.toISOString().split('T')[0],
      baseRate: baseRate,
      seasonalRate: seasonName ? appliedRate : undefined,
      appliedRate,
      weekend: isWeekendDay,
      seasonName,
    });
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

function calculateExtraGuestFee(unitType: any, guests: number): number {
  const extraGuests = Math.max(0, guests - unitType.baseOccupancy);
  return extraGuests * unitType.extraGuestFee;
}

function calculateDiscounts(subtotal: number, coupons: any[]): { totalDiscount: number, discounts: any[] } {
  let totalDiscount = 0;
  const discountDetails = [];
  
  if (coupons && coupons.length > 0) {
    for (const coupon of coupons) {
      if (subtotal >= coupon.minBookingValue) {
        let couponDiscount = 0;
        
        if (coupon.discountType === 'PERCENTAGE') {
          couponDiscount = Math.round(subtotal * (coupon.discountValue / 100));
          
          // Apply max discount cap if exists
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else { // FIXED discount
          couponDiscount = coupon.discountValue;
        }
        
        totalDiscount += couponDiscount;
        
        discountDetails.push({
          name: `Coupon: ${coupon.code}`,
          type: coupon.discountType,
          value: coupon.discountValue,
          amount: couponDiscount,
        });
      }
    }
  }
  
  return { totalDiscount, discounts: discountDetails };
}