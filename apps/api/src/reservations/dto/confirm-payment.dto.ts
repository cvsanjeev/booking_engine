import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Reservation ID' })
  @IsString()
  reservationId: string;

  @ApiProperty({ description: 'Razorpay payment ID' })
  @IsString()
  razorpayPaymentId: string;

  @ApiProperty({ description: 'Razorpay signature' })
  @IsString()
  razorpaySignature: string;
}