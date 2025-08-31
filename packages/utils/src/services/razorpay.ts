import crypto from 'crypto';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance() {
  if (!razorpayInstance) {
    // Create singleton instance
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }
  return razorpayInstance;
}

/**
 * Create a Razorpay order
 * 
 * @param {Object} orderData Order data
 * @returns {Promise<Object>} Created order
 */
export async function createOrder(orderData: {
  amount: number; // in smallest currency unit (paise)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const razorpay = getRazorpayInstance();
  
  return razorpay.orders.create({
    amount: orderData.amount,
    currency: orderData.currency,
    receipt: orderData.receipt,
    notes: orderData.notes,
  });
}

/**
 * Capture a payment
 * 
 * @param {string} paymentId Razorpay payment ID
 * @param {number} amount Amount to capture in smallest currency unit
 * @returns {Promise<Object>} Capture result
 */
export async function capturePayment(paymentId: string, amount: number) {
  const razorpay = getRazorpayInstance();
  
  return razorpay.payments.capture(paymentId, amount);
}

/**
 * Verify payment signature
 * 
 * @param {string} orderId Razorpay order ID
 * @param {string} paymentId Razorpay payment ID
 * @param {string} signature Razorpay signature
 * @returns {boolean} True if signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const text = `${orderId}|${paymentId}`;
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

/**
 * Create a refund
 * 
 * @param {string} paymentId Razorpay payment ID
 * @param {Object} options Refund options
 * @returns {Promise<Object>} Refund result
 */
export async function createRefund(
  paymentId: string, 
  options: {
    amount?: number;
    notes?: Record<string, string>;
  } = {}
) {
  const razorpay = getRazorpayInstance();
  
  return razorpay.payments.refund(paymentId, {
    amount: options.amount,
    notes: options.notes,
  });
}

/**
 * Verify webhook signature
 * 
 * @param {string} body Request body as string
 * @param {string} signature X-Razorpay-Signature header
 * @returns {boolean} True if signature is valid
 */
export function verifyWebhookSignature(body: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}