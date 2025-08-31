import { z } from 'zod';

// Type definitions
export const AvailabilitySearchArgsSchema = z.object({
  propertyId: z.string(),
  checkIn: z.string(), // ISO date
  checkOut: z.string(),
  guests: z.number().int().positive(),
  unitTypes: z.array(z.string()).optional(),
});

export type AvailabilitySearchArgs = z.infer<typeof AvailabilitySearchArgsSchema>;

export type UnitTypeAvailability = {
  unitTypeId: string;
  unitTypeCode: string;
  unitTypeName: string;
  baseRate: number;
  available: boolean;
  availableUnits: number;
  totalUnits: number;
};

export type AvailabilityResult = {
  checkIn: string;
  checkOut: string;
  nights: number;
  unitTypes: UnitTypeAvailability[];
};

/**
 * Checks availability for given dates and returns available unit types with count
 * 
 * @param args - Search parameters (property, dates, guests)
 * @param dbClient - Database client for querying
 * @param redisClient - Redis client for checking active holds
 * @returns Promise<AvailabilityResult> with available unit types
 */
export async function checkAvailability(
  args: AvailabilitySearchArgs,
  dbClient: any,
  redisClient: any
): Promise<AvailabilityResult> {
  // Validate arguments
  const validArgs = AvailabilitySearchArgsSchema.parse(args);
  
  // Convert dates
  const checkIn = new Date(validArgs.checkIn);
  const checkOut = new Date(validArgs.checkOut);
  
  if (checkIn >= checkOut) {
    throw new Error('Check-out must be after check-in');
  }
  
  // Calculate number of nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // 1. Get all unit types for the property
  const unitTypes = await dbClient.unitType.findMany({
    where: {
      propertyId: validArgs.propertyId,
      ...(validArgs.unitTypes?.length ? { code: { in: validArgs.unitTypes } } : {}),
    },
    include: {
      units: {
        where: { active: true },
      },
    },
  });
  
  // 2. Get all confirmed reservations and blocks in the date range
  const [reservations, blocks] = await Promise.all([
    dbClient.reservation.findMany({
      where: {
        propertyId: validArgs.propertyId,
        status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
        // Either check-in or check-out falls within our range, or the stay spans our range
        OR: [
          { 
            AND: [
              { checkIn: { lt: checkOut } },
              { checkIn: { gte: checkIn } },
            ] 
          },
          { 
            AND: [
              { checkOut: { lte: checkOut } },
              { checkOut: { gt: checkIn } },
            ] 
          },
          { 
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gte: checkOut } },
            ] 
          },
        ],
      },
    }),
    dbClient.block.findMany({
      where: {
        propertyId: validArgs.propertyId,
        // Same date range logic as reservations
        OR: [
          { 
            AND: [
              { startDate: { lt: checkOut } },
              { startDate: { gte: checkIn } },
            ] 
          },
          { 
            AND: [
              { endDate: { lte: checkOut } },
              { endDate: { gt: checkIn } },
            ] 
          },
          { 
            AND: [
              { startDate: { lte: checkIn } },
              { endDate: { gte: checkOut } },
            ] 
          },
        ],
      },
    }),
  ]);
  
  // 3. Get all active holds from Redis
  // Format: "hold:propertyId:unitTypeId:YYYY-MM-DD"
  const activeHolds = await getActiveHoldsFromRedis(
    redisClient, 
    validArgs.propertyId, 
    checkIn, 
    checkOut
  );
  
  // 4. Calculate availability for each unit type
  const availabilityResults: UnitTypeAvailability[] = [];
  
  for (const unitType of unitTypes) {
    // Count reservations for this unit type
    const reservationsForType = reservations.filter(
      (r: any) => r.unitTypeId === unitType.id
    );
    
    // Count blocks for this unit type (either specific unit type or specific units of this type)
    const blocksForType = blocks.filter(
      (b: any) => b.unitTypeId === unitType.id || unitType.units.some((u: any) => u.id === b.unitId)
    );
    
    // Count holds for this unit type
    const holdsForType = Object.values(activeHolds)
      .filter((hold: any) => hold.unitTypeId === unitType.id)
      .length;
    
    // Total occupied units
    const occupiedCount = reservationsForType.length + blocksForType.length + holdsForType;
    
    // Total units of this type
    const totalUnits = unitType.units.length;
    
    // Check if enough capacity for requested guests
    const availableUnits = Math.max(0, totalUnits - occupiedCount);
    const available = availableUnits > 0 && unitType.maxOccupancy >= validArgs.guests;
    
    availabilityResults.push({
      unitTypeId: unitType.id,
      unitTypeCode: unitType.code,
      unitTypeName: unitType.name,
      baseRate: unitType.baseRate,
      available,
      availableUnits,
      totalUnits,
    });
  }
  
  return {
    checkIn: validArgs.checkIn,
    checkOut: validArgs.checkOut,
    nights,
    unitTypes: availabilityResults,
  };
}

/**
 * Gets active holds from Redis for a given property and date range
 */
async function getActiveHoldsFromRedis(
  redisClient: any,
  propertyId: string,
  checkIn: Date,
  checkOut: Date
): Promise<Record<string, any>> {
  // Generate all dates in the range
  const dates = [];
  const current = new Date(checkIn);
  
  while (current < checkOut) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  // Get all hold keys for this property and dates
  const holdKeys = [];
  
  for (const date of dates) {
    const pattern = `hold:${propertyId}:*:${date}`;
    const keys = await redisClient.keys(pattern);
    holdKeys.push(...keys);
  }
  
  // Get all hold values
  const holdValues: Record<string, any> = {};
  
  for (const key of holdKeys) {
    const holdData = await redisClient.get(key);
    if (holdData) {
      holdValues[key] = JSON.parse(holdData);
    }
  }
  
  return holdValues;
}