import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

export function ConfirmationDetails({ property, reservation }) {
  // Format dates
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  
  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Booking Details</h2>
          <p className="text-sm text-gray-600">Reference: {reservation.id.slice(-8).toUpperCase()}</p>
        </div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
            {reservation.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Property</h3>
            <p>{property.name}</p>
            <p className="text-sm text-gray-600">{property.address}</p>
            <p className="text-sm text-gray-600">{property.city}, {property.country}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Unit</h3>
            <p>{reservation.unitTypeName}</p>
            {reservation.unitId && (
              <p className="text-sm text-gray-600">Unit: {reservation.unitCode || 'To be assigned'}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Guest</h3>
            <p>{reservation.customerName}</p>
            <p className="text-sm text-gray-600">{reservation.customerEmail}</p>
            {reservation.customerPhone && (
              <p className="text-sm text-gray-600">{reservation.customerPhone}</p>
            )}
          </div>
        </div>
        
        {/* Right column */}
        <div>
          <div>
            <h3 className="font-semibold mb-3">Dates</h3>
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <p className="font-medium">Check-in</p>
                <p>{format(checkIn, 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-gray-600">From {property.settings?.checkInTime || '14:00'}</p>
              </div>
              <div>
                <p className="font-medium">Check-out</p>
                <p>{format(checkOut, 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-gray-600">Until {property.settings?.checkOutTime || '11:00'}</p>
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-gray-50">
              <Calendar
                mode="range"
                selected={{
                  from: checkIn,
                  to: checkOut,
                }}
                className="w-full"
                disabled
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Guests</h3>
            <p>{reservation.adults} {reservation.adults === 1 ? 'adult' : 'adults'}{reservation.children > 0 ? `, ${reservation.children} ${reservation.children === 1 ? 'child' : 'children'}` : ''}</p>
          </div>
          
          {reservation.specialRequests && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Special Requests</h3>
              <p className="text-sm text-gray-600">{reservation.specialRequests}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a href={`/api/${property.code}/reservation/${reservation.id}/invoice`} target="_blank" rel="noopener noreferrer">
              Download Invoice
            </a>
          </Button>
          
          <Button variant="outline" asChild>
            <a href={`/api/${property.code}/reservation/${reservation.id}/ical`} download="booking.ics">
              Add to Calendar
            </a>
          </Button>
        </div>
      </div>
      
      {/* Cancellation policy */}
      <div className="mt-8 bg-gray-50 p-4 rounded text-sm">
        <h3 className="font-semibold mb-2">Cancellation Policy</h3>
        <p>
          {reservation.status === 'CONFIRMED' ? (
            <>Free cancellation until {format(new Date(checkIn.getTime() - 24 * 60 * 60 * 1000), 'MMM d, yyyy')} at {property.settings?.cancellationTime || '14:00'}. After that, the reservation is non-refundable.</>
          ) : (
            <>This reservation has been {reservation.status.toLowerCase()}.</>
          )}
        </p>
      </div>
    </div>
  );
}