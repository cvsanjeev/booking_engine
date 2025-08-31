import { notFound } from 'next/navigation';
import { SearchResults } from '@/components/booking/search-results';
import { BookingSearch } from '@/components/booking/search-form';
import { getPropertyByCode, getProperties } from '@/lib/api/properties';
import { searchAvailability } from '@/lib/api/availability';

export default async function SearchPage({ 
  params, 
  searchParams 
}: { 
  params: { propertyCode: string },
  searchParams: { checkIn: string, checkOut: string, guests: string }
}) {
  const { propertyCode } = params;
  const { checkIn, checkOut, guests } = searchParams;
  
  // Validate params
  if (!checkIn || !checkOut || !guests) {
    notFound();
  }
  
  // Load property data
  const [property, properties] = await Promise.all([
    getPropertyByCode(propertyCode),
    getProperties()
  ]);
  
  if (!property) {
    notFound();
  }
  
  // Convert guests to number and dates to Date objects
  const guestsCount = parseInt(guests, 10);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Search for availability
  const availability = await searchAvailability({
    propertyId: property.id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    adults: guestsCount,
    children: 0,
  });
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search form in sticky header */}
      <div className="sticky top-0 z-10 bg-white shadow-md py-4 border-b">
        <div className="container mx-auto px-4">
          <BookingSearch properties={properties} />
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {availability.filter(ut => ut.available > 0).length} Available Options at {property.name}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters - can be expanded */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              <div className="space-y-4">
                {/* Price filter */}
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  {/* Price range slider could go here */}
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                
                {/* Amenities filter */}
                <div>
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="space-y-2">
                    {['WiFi', 'Air Conditioning', 'Kitchen', 'Washer'].map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="ml-2">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search results */}
          <div className="lg:col-span-9">
            <SearchResults 
              property={property} 
              availability={availability} 
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guestsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}