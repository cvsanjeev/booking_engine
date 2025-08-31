interface Property {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-2">{property.name}</h3>
          <p className="text-blue-100">{property.city}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-600 text-sm">{property.address}</p>
            <p className="text-gray-500 text-xs mt-1">{property.country}</p>
          </div>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
          Book Now
        </button>
      </div>
    </div>
  );
}