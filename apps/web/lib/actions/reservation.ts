'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/api/client';
import { z } from 'zod';

export async function createReservationHold(data: {
  propertyCode: string;
  unitTypeCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  try {
    const idempotencyKey = uuidv4();
    const api = createClient();
    
    const response = await api.post(
      `/${data.propertyCode}/reservations/hold`,
      {
        unitTypeCode: data.unitTypeCode,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    
    return {    
      success: true,
      holdId: response.data.id,
      expiresAt: response.data.expiresAt,
    };
  } catch (error) {
    console.error('Failed to create reservation hold:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create hold',
    };
  }
}

export async function createReservationPayment(data: {
  holdId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  specialRequests?: string;
  saveInfo?: boolean;
}) {
  try {
    const idempotencyKey = uuidv4();
    const api = createClient();
    
    // Extract property code from URL in the server action context
    const url = new URL(headers().get('referer') || '');
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const propertyCode = pathSegments[0];
    
    if (!propertyCode) {
      throw new Error('Property code not found in URL');
    }
    
    // Save customer info in cookie if requested
    if (data.saveInfo) {
      cookies().set('customerInfo', JSON.stringify({
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        address: data.customerAddress,
      }), { 
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }
    
    // Create checkout/payment order
    const response = await api.post(
      `/${propertyCode}/reservations/checkout`,
      {
        holdId: data.holdId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress || '',
        specialRequests: data.specialRequests || '',
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    
    return {
      success: true,
      reservationId: response.data.reservationId,
      razorpayOrderId: response.data.razorpayOrderId,
    };
  } catch (error) {
    console.error('Failed to create payment:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create payment',
    };
  }
}

export async function verifyPayment(reservationId: string, paymentId: string) {
  try {
    const idempotencyKey = uuidv4();
    const api = createClient();
    
    // Extract property code from URL in the server action context
    const url = new URL(headers().get('referer') || '');
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const propertyCode = pathSegments[0];
    
    if (!propertyCode) {
      throw new Error('Property code not found in URL');
    }
    
    // Verify and confirm payment
    const response = await api.post(
      `/${propertyCode}/reservations/confirm`,
      {
        reservationId,
        razorpayPaymentId: paymentId,
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      }
    );
    
    return {
      success: true,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to verify payment',
    };
  }
}

export async function cancelReservation(
  propertyCode: string, 
  reservationId: string, 
  reason: string
) {
  try {
    const api = createClient();
    
    const response = await api.post(
      `/${propertyCode}/reservations/cancel`,
      {
        reservationId,
        reason,
      }
    );
    
    return {
      success: true,
      status: response.data.status,
      refundAmount: response.data.refundAmount,
    };
  } catch (error) {
    console.error('Failed to cancel reservation:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel reservation',
    };
  }
}

export async function applyPromoCode(
  holdId: string, 
  code: string
) {
  try {
    const api = createClient();
    
    // Extract property code from URL in the server action context
    const url = new URL(headers().get('referer') || '');
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const propertyCode = pathSegments[0];
    
    if (!propertyCode) {
      throw new Error('Property code not found in URL');
    }
    
    const response = await api.post(
      `/${propertyCode}/reservations/promo`,
      {
        holdId,
        couponCode: code,
      }
    );
    
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    console.error('Failed to apply promo code:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Invalid promo code',
    };
  }
}