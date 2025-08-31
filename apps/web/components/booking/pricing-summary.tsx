'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Users, 
  Clock, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  TagIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { applyPromoCode } from '@/lib/actions/reservation';

interface PricingSummaryProps {
  property: any;
  hold: any;
}

export function PricingSummary({ property, hold }: PricingSummaryProps) {
  const [isNightlyBreakdownOpen, setIsNightlyBreakdownOpen] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  
  const checkIn = new Date(hold.checkIn);
  const checkOut = new Date(hold.checkOut);
  const nights = hold.breakdown?.nights || 
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  const toggleNightlyBreakdown = () => {
    setIsNightlyBreakdownOpen(!isNightlyBreakdownOpen);
  };
  
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    setPromoError('');
    
    try {
      const result = await applyPromoCode({ holdId: hold.id, promoCode });
      
      if (!result.discount) {
        setPromoError('Invalid promo code');
      } else {
        // Refresh the page to show updated pricing
        window.location.reload();
      }
    } catch (error) {
      setPromoError('Failed to apply promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-bold text-lg mb-4">Booking Summary</h2>
      
      {/* Property and unit info */}
      <div className="mb-4">
        <h3 className="font-semibold">{hold.unitTypeName || 'Selected Unit'}</h3>
        <p className="text-sm text-gray-600">{property.name}</p>
      </div>
      
      <Separator className="my-4" />
      
      {/* Check-in/out info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <CalendarIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Check-in</p>
            <p className="text-sm text-gray-600">
              {format(checkIn, 'EEE, MMM d, yyyy')}
              <span className="text-xs ml-1 text-gray-500">
                (from {property.settings?.checkInTime || '14:00'})
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CalendarIcon className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Check-out</p>
            <p className="text-sm text-gray-600">
              {format(checkOut, 'EEE, MMM d, yyyy')}
              <span className="text-xs ml-1 text-gray-500">
                (until {property.settings?.checkOutTime || '11:00'})
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-gray-600">{nights} {nights === 1 ? 'night' : 'nights'}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Users className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Guests</p>
            <p className="text-sm text-gray-600">{hold.adults} {hold.adults === 1 ? 'adult' : 'adults'}{hold.children > 0 ? `, ${hold.children} ${hold.children === 1 ? 'child' : 'children'}` : ''}</p>
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <button
            onClick={toggleNightlyBreakdown}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
            {isNightlyBreakdownOpen ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
          <span className="text-sm">
            {formatCurrency(hold.subtotal / 100, property.currency)}
          </span>
        </div>
        
        {isNightlyBreakdownOpen && hold.breakdown?.nightly && (
          <div className="pl-4 space-y-2 pt-2">
            {hold.breakdown.nightly.map((night: any, index: number) => (
              <div key={index} className="flex justify-between text-xs text-gray-600">
                <span>{format(new Date(night.date), 'EEE, MMM d')}</span>
                <span>
                  {formatCurrency(night.appliedRate / 100, property.currency)}
                  {night.weekend && <span className="ml-1 text-blue-600">*</span>}
                  {night.seasonName && <span className="ml-1 text-orange-600">†</span>}
                </span>
              </div>
            ))}
            
            <div className="text-xs text-gray-600 pt-1">
              {hold.breakdown.nightly.some((n: any) => n.weekend) && (
                <p><span className="text-blue-600">*</span> Weekend rate</p>
              )}
              {hold.breakdown.nightly.some((n: any) => n.seasonName) && (
                <p><span className="text-orange-600">†</span> Seasonal rate</p>
              )}
            </div>
          </div>
        )}
        
        {hold.breakdown?.fees?.map((fee: any, index: number) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{fee.name}</span>
            <span>{formatCurrency(fee.amount / 100, property.currency)}</span>
          </div>
        ))}
        
        {hold.breakdown?.taxes?.map((tax: any, index: number) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{tax.name} ({tax.rate}%)</span>
            <span>{formatCurrency(tax.amount / 100, property.currency)}</span>
          </div>
        ))}
        
        {hold.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(hold.discount / 100, property.currency)}</span>
          </div>
        )}
      </div>
      
      {/* Promo code section */}
      {!hold.couponCode && (
        <>
          <div className="mt-4 flex space-x-2">
            <div className="relative flex-grow">
              <TagIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Promo code"
                className="pl-8"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isApplyingPromo}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyPromo}
              disabled={!promoCode || isApplyingPromo}
            >
              {isApplyingPromo ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          
          {promoError && (
            <p className="text-xs text-red-500 mt-1">{promoError}</p>
          )}
        </>
      )}
      
      {hold.couponCode && (
        <div className="mt-4 flex justify-between text-sm">
          <span className="flex items-center text-green-600">
            <TagIcon className="h-4 w-4 mr-1" />
            Code: {hold.couponCode}
          </span>
          <span className="text-green-600">
            -{formatCurrency(hold.couponDiscount / 100, property.currency)}
          </span>
        </div>
      )}
      
      <Separator className="my-4" />
      
      {/* Total */}
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>{formatCurrency(hold.total / 100, property.currency)}</span>
      </div>
      
      {/* Payment info */}
      {hold.status === 'CONFIRMED' && (
        <div className="mt-4 flex items-center justify-center bg-green-50 p-2 rounded">
          <CreditCard className="h-4 w-4 mr-2 text-green-600" />
          <span className="text-sm text-green-600">Paid in full</span>
        </div>
      )}
    </div>
  );
}