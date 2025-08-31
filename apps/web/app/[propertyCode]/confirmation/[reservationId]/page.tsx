import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReservation } from '@/lib/api/reservations';
import { getPropertyByCode } from '@/lib/api/properties';
import { Button } from '@/components/ui/button';
import { PricingSummary } from '@/components/booking/pricing-summary';
import { ConfirmationDetails } from '@/components/booking/confirmation-details';
import { verifyPayment } from '@/lib/actions/reservation';

export default async function ConfirmationPage({ 
  params,
  searchParams
}: { 
  params: { propertyCode: string, reservationId: string },
  searchParams: { paymentId?: string }
}) {
  const { propertyCode, reservationId } = params;
  const { paymentId } = searchParams;
  
  // Get property and reservation data
  const [property, initialReservation] = await Promise.all([
    getPropertyByCode(propertyCode),
    getReservation(reservationId)
  ]);
  
  // Validate data
  if (!property || !initialReservation) {
    notFound();
  }
  
  // Verify payment if paymentId is provided and reservation is in PENDING_PAYMENT state
  let reservation = initialReservation;
  if (paymentId && reservation.status === 'PENDING_PAYMENT') {
    await verifyPayment({ reservationId, paymentId });
    
    // Refresh reservation data after payment verification
    const updatedReservation = await getReservation(reservationId);
    if (updatedReservation) {
      reservation = updatedReservation;
    }
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              {reservation.status === 'CONFIRMED' 
                ? 'Booking Confirmed!' 
                : 'Booking Pending'}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {reservation.status === 'CONFIRMED' 
                ? 'Your booking has been confirmed. We\'ve sent a confirmation email to your registered email address.' 
                : 'We are processing your payment. You will receive a confirmation email once completed.'}
            </p>
            
            <div className="text-sm bg-gray-50 p-3 rounded inline-block">
              Booking Reference: <span className="font-mono font-bold">{reservation.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
          
          {/* Confirmation details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ConfirmationDetails property={property} reservation={reservation} />
              
              <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                <h3 className="font-bold mb-4">What's Next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm">Check your email for a confirmation with all details</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm">Add your stay to your calendar</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm">Check-in will be available from {property.settings.checkInTime || '14:00'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                  href={`/${property.code}/manage/${reservation.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2"
                >
                  Manage Booking
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
            
            {/* Price summary */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <PricingSummary property={property} hold={reservation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}