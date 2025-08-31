import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
  constructor(private readonly prisma: PrismaService) {}

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
      
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );
    } catch (error) {
      return false;
    }
  }

  async processWebhookEvent(payload: any): Promise<any> {
    const { event, payload: eventPayload } = payload;
    
    // Handle different event types
    switch (event) {
      case 'payment.authorized':
        // Handle payment authorized
        break;
      case 'payment.captured':
        // Handle payment captured
        break;
      case 'payment.failed':
        // Handle payment failed
        break;
      case 'refund.processed':
        // Handle refund processed
        break;
      default:
        // Unknown event type
    }
    
    return { received: true };
  }
}