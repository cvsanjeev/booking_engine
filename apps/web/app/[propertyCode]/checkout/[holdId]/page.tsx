import { notFound } from 'next/navigation';
import { Checkout } from '@/components/booking/checkout';
import { getReservationHold } from '@/lib/api/reservations';
import { getPropertyByCode } from '@/lib/api/properties';
import { PricingSummary } from '@/components/booking/pricing-summary';

export default async function CheckoutPage({ 
  params 
}: { 
  params: { propertyCode: string, holdId: string }
}) {
  const { propertyCode, holdId } = params;
  
  // Get property and reservation hold data
  const [property, hold] = await Promise.all([
    getPropertyByCode(propertyCode),
    getReservationHold(holdId)
  ]);
  
  // Validate data
  if (!property || !hold || hold.status !== 'HOLD') {
    notFound();
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <Checkout property={property} hold={hold} />
          </div>
          
          {/* Price summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PricingSummary property={property} hold={hold} />
              
              {/* Trust indicators */}
              <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium mb-4">Safe & Secure Booking</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Secure Payment</p>
                      <p className="text-xs text-gray-500">Your payment is protected by Razorpay</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Privacy Protected</p>
                      <p className="text-xs text-gray-500">Your personal information is encrypted and secure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Easy Payments</p>
                      <p className="text-xs text-gray-500">Pay with credit/debit card, UPI, or net banking</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <img 
                      src="/images/razorpay-logo.png" 
                      alt="Powered by Razorpay" 
                      className="h-6 mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}