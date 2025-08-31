'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Carousel } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, Wifi, Coffee, Users, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createReservationHold } from '@/lib/actions/reservation';

type SearchResultsProps = {
  property: any;
  availability: any;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export function SearchResults({ property, availability, checkIn, checkOut, guests }: SearchResultsProps) {
  const router = useRouter();
  const [loadingUnitType, setLoadingUnitType] = useState<string | null>(null);
  
  // Filter only available units
  const availableUnitTypes = availability.unitTypes.filter(ut => ut.available);
  
  // Handle booking
  async function handleBookNow(unitTypeCode: string) {
    setLoadingUnitType(unitTypeCode);
    
    try {
      // Create a hold for this unit type
      const result = await createReservationHold({
        propertyCode: property.code,
        unitTypeCode,
        checkIn,
        checkOut,
        guests,
      });
      
      if (result.success && result.holdId) {
        // Navigate to checkout
        router.push(`/${property.code}/checkout/${result.holdId}`);
      } else {
        throw new Error(result.error || 'Failed to create hold');
      }
    } catch (error) {
      console.error('Failed to create hold:', error);
      // Show error message
      alert('Sorry, we could not reserve this unit. Please try again.');
    } finally {
      setLoadingUnitType(null);
    }
  }
  
  // If no results
  if (availableUnitTypes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Availability</h2>
        <p className="text-gray-600 mb-6">
          We don't have any available units for the selected dates and number of guests.
        </p>
        <p className="mb-6">
          Try adjusting your dates or reducing the number of guests.
        </p>
        <Button onClick={() => router.back()}>Modify Search</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Sort and view options (can be expanded) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <span className="text-sm text-gray-600">
            {availableUnitTypes.length} options available
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Sort by:</span>
          <select className="text-sm border-0 focus:ring-0">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Recommended</option>
          </select>
        </div>
      </div>
      
      {/* Results */}
      {availableUnitTypes.map((unitType) => (
        <div key={unitType.unitTypeId} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Unit type images */}
            <div className="md:col-span-1 relative h-64 md:h-full">
              <Carousel images={unitType.images || [
                `/units/${unitType.unitTypeCode.toLowerCase()}-1.jpg`,
                `/units/${unitType.unitTypeCode.toLowerCase()}-2.jpg`,
              ]} />
            </div>
            
            {/* Unit details */}
            <div className="md:col-span-2 p-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">{unitType.unitTypeName}</h2>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant="secondary">
                      <Users size={14} className="mr-1" />
                      Up to {unitType.maxOccupancy} guests
                    </Badge>
                    <Badge variant="outline">
                      {unitType.availableUnits} available
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-sm text-gray-500">
                    {availability.nights} {availability.nights > 1 ? 'nights' : 'night'}
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(unitType.baseRate / 100, property.currency)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(unitType.baseRate / 100 / availability.nights, property.currency)} per night
                  </div>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {['WiFi', 'Air Conditioning', 'Kitchen', 'TV'].map(amenity => (
                  <div key={amenity} className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="mr-2 text-green-500" />
                    {amenity}
                  </div>
                ))}
              </div>
              
              {/* Description */}
              <p className="mt-4 text-gray-600">
                {unitType.description || `Spacious ${unitType.unitTypeName.toLowerCase()} with modern amenities, perfect for your stay.`}
              </p>
              
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="text-blue-600 bg-blue-50">Free cancellation</Badge>
                </div>
                
                <Button 
                  onClick={() => handleBookNow(unitType.unitTypeCode)}
                  disabled={loadingUnitType === unitType.unitTypeCode}
                >
                  {loadingUnitType === unitType.unitTypeCode ? 'Reserving...' : 'Book Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}