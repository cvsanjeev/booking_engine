import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ description: 'Hold ID' })
  @IsString()
  holdId: string;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsString()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'Customer address', required: false })
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiProperty({ description: 'Special requests', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}