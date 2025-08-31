import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create properties
  const blrProperty = await prisma.property.upsert({
    where: { code: 'BLR-A1' },
    update: {},
    create: {
      code: 'BLR-A1',
      name: 'Bangalore Central Apartments',
      address: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      settings: {
        checkInTime: '14:00',
        checkOutTime: '11:00',
        holdTTL: 15, // minutes
        taxes: [
          { name: 'GST', percentage: 18 },
        ],
        branding: {
          primaryColor: '#4f46e5',
          logo: '/logos/blr-central.png',
        }
      }
    }
  });

  const delProperty = await prisma.property.upsert({
    where: { code: 'DEL-A1' },
    update: {},
    create: {
      code: 'DEL-A1',
      name: 'Delhi Premium Suites',
      address: '45 Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110001',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      settings: {
        checkInTime: '15:00',
        checkOutTime: '12:00',
        holdTTL: 15, // minutes
        taxes: [
          { name: 'GST', percentage: 18 },
        ],
        branding: {
          primaryColor: '#0f766e',
          logo: '/logos/del-premium.png',
        }
      }
    }
  });

  // Define unit types for each property
  const unitTypeConfigs = [
    { code: '1A', name: 'Studio Apartment', baseRate: 299900, baseOccupancy: 2, maxOccupancy: 2 },
    { code: '1B', name: 'One Bedroom Suite', baseRate: 399900, baseOccupancy: 2, maxOccupancy: 3 },
    { code: 'A1', name: 'Deluxe Studio', baseRate: 349900, baseOccupancy: 2, maxOccupancy: 2 },
    { code: 'B1', name: 'Premium One Bedroom', baseRate: 449900, baseOccupancy: 2, maxOccupancy: 3 },
    { code: 'C1', name: 'Executive Suite', baseRate: 599900, baseOccupancy: 2, maxOccupancy: 4 },
    { code: 'D1', name: 'Two Bedroom Apartment', baseRate: 699900, baseOccupancy: 4, maxOccupancy: 6 },
    { code: '1C', name: 'Penthouse Suite', baseRate: 999900, baseOccupancy: 4, maxOccupancy: 6 },
  ];

  // Function to create unit types and units for a property
  async function createUnitsForProperty(property: any) {
    console.log(`Creating unit types and units for ${property.name}...`);
    
    for (const config of unitTypeConfigs) {
      // Create unit type
      const unitType = await prisma.unitType.upsert({
        where: {
          propertyId_code: {
            propertyId: property.id,
            code: config.code,
          }
        },
        update: {},
        create: {
          propertyId: property.id,
          code: config.code,
          name: config.name,
          baseRate: config.baseRate,
          baseOccupancy: config.baseOccupancy,
          maxOccupancy: config.maxOccupancy,
          extraGuestFee: 100000,
          cleaningFee: 50000,
          description: `Spacious ${config.name.toLowerCase()} with modern amenities.`,
          amenities: ['WiFi', 'Air Conditioning', 'TV', 'Kitchen', 'Washer'],
          images: [
            `/units/${config.code.toLowerCase()}-1.jpg`,
            `/units/${config.code.toLowerCase()}-2.jpg`,
          ],
        }
      });
      
      // Create 4 units for each unit type
      for (let i = 1; i <= 4; i++) {
        const unitCode = `${config.code}-${i.toString().padStart(2, '0')}`;
        await prisma.unit.upsert({
          where: {
            propertyId_code: {
              propertyId: property.id,
              code: unitCode,
            }
          },
          update: {},
          create: {
            propertyId: property.id,
            typeId: unitType.id,
            code: unitCode,
            name: `${config.name} ${i}`,
            floor: Math.floor(i / 2) + 1,
            active: true,
          }
        });
      }
    }
  }

  // Create unit types and units for each property
  await createUnitsForProperty(blrProperty);
  await createUnitsForProperty(delProperty);

  // Create rate plans for each property
  async function createRatePlans(property: any) {
    console.log(`Creating rate plans for ${property.name}...`);
    
    // Standard rate plan (applies to all unit types)
    await prisma.ratePlan.upsert({
      where: {
        propertyId_code: {
          propertyId: property.id,
          code: 'STD',
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        name: 'Standard Rate',
        code: 'STD',
        description: 'Our standard flexible rate with free cancellation up to 24 hours before check-in',
        isDefault: true,
        weekendUplift: 20, // 20% uplift for weekends
        depositRate: 100, // Full payment at booking
        advanceDays: 0,
        minStay: 1,
        cancellationPolicyType: 'FLEXIBLE',
        cancellationFeePercent: 0,
        freeCancellationHours: 24,
        active: true,
      }
    });
    
    // Advanced purchase rate (cheaper but non-refundable)
    await prisma.ratePlan.upsert({
      where: {
        propertyId_code: {
          propertyId: property.id,
          code: 'ADV',
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        name: 'Advanced Purchase',
        code: 'ADV',
        description: 'Save 15% with our non-refundable rate when booking 14 days in advance',
        isDefault: false,
        baseRate: -15, // 15% discount on base rate
        weekendUplift: 10, // 10% uplift for weekends (less than standard)
        depositRate: 100, // Full payment at booking
        advanceDays: 14, // Must book 14 days in advance
        minStay: 1,
        cancellationPolicyType: 'STRICT',
        cancellationFeePercent: 100, // Non-refundable
        freeCancellationHours: 0,
        active: true,
      }
    });
    
    // Weekly rate plan
    await prisma.ratePlan.upsert({
      where: {
        propertyId_code: {
          propertyId: property.id,
          code: 'WEEKLY',
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        name: 'Weekly Stay',
        code: 'WEEKLY',
        description: 'Special rate for 7+ night stays with 20% discount',
        isDefault: false,
        baseRate: -20, // 20% discount
        weekendUplift: 10,
        depositRate: 30, // 30% deposit
        advanceDays: 0,
        minStay: 7,
        cancellationPolicyType: 'MODERATE',
        cancellationFeePercent: 50,
        freeCancellationHours: 72,
        active: true,
      }
    });
  }

  await createRatePlans(blrProperty);
  await createRatePlans(delProperty);

  // Create seasons for each property
  async function createSeasons(property: any) {
    console.log(`Creating seasons for ${property.name}...`);
    
    // Get all unit types for this property
    const unitTypes = await prisma.unitType.findMany({
      where: { propertyId: property.id }
    });
    
    // Create rate mappings for each season
    const highSeasonRates = {};
    const peakSeasonRates = {};
    
    // Set rates for each unit type
    unitTypes.forEach(unitType => {
      highSeasonRates[unitType.id] = Math.round(unitType.baseRate * 1.2); // 20% higher
      peakSeasonRates[unitType.id] = Math.round(unitType.baseRate * 1.5); // 50% higher
    });
    
    // High Season (e.g., October-November for Bangalore)
    await prisma.season.upsert({
      where: {
        id: `high-season-${property.code}-2025`,
      },
      update: {},
      create: {
        id: `high-season-${property.code}-2025`,
        propertyId: property.id,
        name: 'High Season 2025',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-11-30'),
        rates: highSeasonRates,
        active: true,
      }
    });
    
    // Peak Season (e.g., December-January for New Year's)
    await prisma.season.upsert({
      where: {
        id: `peak-season-${property.code}-2025`,
      },
      update: {},
      create: {
        id: `peak-season-${property.code}-2025`,
        propertyId: property.id,
        name: 'Peak Season 2025-2026',
        startDate: new Date('2025-12-20'),
        endDate: new Date('2026-01-10'),
        rates: peakSeasonRates,
        active: true,
      }
    });
  }
  
  await createSeasons(blrProperty);
  await createSeasons(delProperty);
  
  // Create coupons
  async function createCoupons(property: any) {
    console.log(`Creating coupons for ${property.name}...`);
    
    // WELCOME10 - 10% discount capped at ₹2000
    await prisma.coupon.upsert({
      where: {
        propertyId_code: {
          propertyId: property.id,
          code: 'WELCOME10',
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        code: 'WELCOME10',
        description: '10% off your first booking',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        maxDiscount: 200000, // ₹2000 in paise
        minBookingValue: 0,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        usageLimit: 1000,
        active: true,
      }
    });
    
    // FLAT500 - ₹500 discount
    await prisma.coupon.upsert({
      where: {
        propertyId_code: {
          propertyId: property.id,
          code: 'FLAT500',
        }
      },
      update: {},
      create: {
        propertyId: property.id,
        code: 'FLAT500',
        description: '₹500 off your booking',
        discountType: 'FIXED',
        discountValue: 50000, // ₹500 in paise
        minBookingValue: 300000, // Minimum booking value ₹3000
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        usageLimit: 500,
        active: true,
      }
    });
  }
  
  await createCoupons(blrProperty);
  await createCoupons(delProperty);
  
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      role: 'ADMIN',
      properties: [blrProperty.id, delProperty.id], // Access to all properties
      passwordHash: '$2a$12$k8Y1Nc9uYyk8UONPjBZRSu/G5lcUQFuFAGfSKUZgSPBtR4nR5s2Ne', // "password123" - in production use proper password hashing
      emailVerified: new Date(),
    }
  });
  
  console.log('✅ Seed completed successfully');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });