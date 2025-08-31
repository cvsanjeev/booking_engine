import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  @ApiProperty({ description: 'Reservation ID' })
  id: string;

  @ApiProperty({ description: 'Property ID' })
  propertyId: string;

  @ApiProperty({ description: 'Unit type ID' })
  unitTypeId: string;

  @ApiProperty({ description: 'Unit ID', required: false })
  unitId?: string;

  @ApiProperty({ description: 'Reservation status' })
  status: string;

  @ApiProperty({ description: 'Check-in date' })
  checkIn: Date;

  @ApiProperty({ description: 'Check-out date' })
  checkOut: Date;

  @ApiProperty({ description: 'Number of adult guests' })
  adults: number;

  @ApiProperty({ description: 'Number of child guests', required: false })
  children?: number;

  @ApiProperty({ description: 'Subtotal amount (in smallest currency unit)' })
  subtotal: number;

  @ApiProperty({ description: 'Tax amount (in smallest currency unit)' })
  tax: number;

  @ApiProperty({ description: 'Fees amount (in smallest currency unit)' })
  fees: number;

  @ApiProperty({ description: 'Discount amount (in smallest currency unit)' })
  discount: number;

  @ApiProperty({ description: 'Total amount (in smallest currency unit)' })
  total: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Customer email' })
  customerEmail: string;

  @ApiProperty({ description: 'Customer name', required: false })
  customerName?: string;

  @ApiProperty({ description: 'Razorpay order ID', required: false })
  razorpayOrderId?: string;

  @ApiProperty({ description: 'Razorpay payment ID', required: false })
  razorpayPaymentId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}