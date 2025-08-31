interface Property {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
}

interface PropertySelectorProps {
  properties: Property[];
  value?: string;
  onChange?: (value: string) => void;
}

export function PropertySelector({ properties, value, onChange }: PropertySelectorProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select a property</option>
      {properties.map((property) => (
        <option key={property.id} value={property.code}>
          {property.name} - {property.city}
        </option>
      ))}
    </select>
  );
}