import { Module } from '@nestjs/common';
import { RazorpayWebhookController } from './razorpay/razorpay.controller';
import { RazorpayService } from './razorpay/razorpay.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RazorpayWebhookController],
  providers: [RazorpayService],
})
export class WebhooksModule {}