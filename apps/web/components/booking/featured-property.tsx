interface Property {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
}

interface FeaturedPropertyProps {
  property: Property;
}

export function FeaturedProperty({ property }: FeaturedPropertyProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
      <h3 className="text-2xl font-bold mb-4">Featured Property</h3>
      <h4 className="text-xl mb-2">{property.name}</h4>
      <p className="mb-4 opacity-90">{property.address}, {property.city}</p>
      <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
        View Details
      </button>
    </div>
  );
}