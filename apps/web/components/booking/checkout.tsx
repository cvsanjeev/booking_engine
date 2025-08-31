'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { createReservationPayment } from '@/lib/actions/reservation';

// Form schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(8, { message: 'Please enter a valid phone number' }),
  address: z.string().optional(),
  specialRequests: z.string().optional(),
  saveInfo: z.boolean().default(true),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function Checkout({ property, hold }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      specialRequests: '',
      saveInfo: true,
      agreeTerms: false,
    },
  });
  
  // Form submission handler
  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Combine name fields
      const customerName = `${data.firstName} ${data.lastName}`;
      
      // Create payment order
      const paymentResult = await createReservationPayment({
        holdId: hold.id,
        customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerAddress: data.address,
        specialRequests: data.specialRequests,
        saveInfo: data.saveInfo,
      });
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to create payment');
      }
      
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: hold.total,
        currency: property.currency,
        name: property.name,
        description: `Booking for ${hold.unitTypeName}`,
        order_id: paymentResult.razorpayOrderId,
        prefill: {
          name: customerName,
          email: data.email,
          contact: data.phone,
        },
        notes: {
          propertyCode: property.code,
          holdId: hold.id,
        },
        theme: {
          color: '#4f46e5',
        },
        handler: function(response) {
          // Handle successful payment
          handlePaymentSuccess(response);
        },
      };
      
      const razorpayWindow = new (window as any).Razorpay(options);
      razorpayWindow.open();
      
    } catch (err) {
      console.error('Payment initialization failed:', err);
      setError('Sorry, we could not process your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Handle Razorpay payment success
  async function handlePaymentSuccess(response) {
    try {
      // Navigate to confirmation page
      router.push(`/${property.code}/confirmation/${hold.id}?paymentId=${response.razorpay_payment_id}`);
    } catch (err) {
      console.error('Error handling payment success:', err);
      setError('Payment was received, but we encountered a problem. Please contact support.');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Guest Information</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Contact information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Special requests */}
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requirements or requests" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Please note that special requests are subject to availability.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Checkboxes */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="saveInfo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Save my information for future bookings
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions, cancellation policy, and privacy policy
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full py-6 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Pay ${property.currency} ${(hold.total / 100).toFixed(2)}`}
          </Button>
        </form>
      </Form>
    </div>
  );
}