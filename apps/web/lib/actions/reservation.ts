'use server';

import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// Mock implementation for demo purposes
export async function createReservationHold(data: {
  propertyCode: string;
  unitTypeCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  try {
    const idempotencyKey = uuidv4();
    
    // For demo purposes, return a mock response
    return {
      holdId: idempotencyKey,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error creating reservation hold:', error);
    throw new Error('Failed to create reservation hold');
  }
}

export async function createReservationPayment(data: {
  holdId: string;
  paymentMethod: string;
  customerInfo: any;
}) {
  try {
    // For demo purposes, return a mock response
    return {
      orderId: `order_${uuidv4()}`,
      amount: 16520,
      currency: 'INR',
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
}

export async function verifyPayment(data: {
  reservationId: string;
  paymentId: string;
}) {
  try {
    // For demo purposes, return success
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
}

export async function cancelReservation(data: {
  reservationId: string;
  reason?: string;
}) {
  try {
    // For demo purposes, return success
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw new Error('Failed to cancel reservation');
  }
}

export async function applyPromoCode(data: {
  holdId: string;
  promoCode: string;
}) {
  try {
    // For demo purposes, return a mock discount
    return {
      discount: 1000, // 10 INR discount
      promoCode: data.promoCode,
    };
  } catch (error) {
    console.error('Error applying promo code:', error);
    throw new Error('Invalid promo code');
  }
}