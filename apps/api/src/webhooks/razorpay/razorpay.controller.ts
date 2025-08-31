import { 
  Controller, 
  Post, 
  Body, 
  Headers, 
  HttpCode, 
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RazorpayService } from './razorpay.service';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('webhooks')
@Controller('webhooks/razorpay')
@SkipThrottle()
export class RazorpayWebhookController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle Razorpay webhook events' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() payload: any,
  ): Promise<any> {
    if (!signature) {
      throw new BadRequestException('Missing Razorpay signature');
    }

    const isValid = this.razorpayService.verifyWebhookSignature(
      JSON.stringify(payload),
      signature,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid Razorpay signature');
    }

    return this.razorpayService.processWebhookEvent(payload);
  }
}