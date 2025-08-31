import { ApiProperty } from '@nestjs/swagger';

export class PropertyDto {
  @ApiProperty({ description: 'Property ID' })
  id: string;

  @ApiProperty({ description: 'Property code' })
  code: string;

  @ApiProperty({ description: 'Property name' })
  name: string;

  @ApiProperty({ description: 'Property address', required: false })
  address?: string;

  @ApiProperty({ description: 'Property city', required: false })
  city?: string;

  @ApiProperty({ description: 'Property state', required: false })
  state?: string;

  @ApiProperty({ description: 'Property country', required: false })
  country?: string;

  @ApiProperty({ description: 'Property timezone', default: 'Asia/Kolkata' })
  timezone: string;

  @ApiProperty({ description: 'Property currency', default: 'INR' })
  currency: string;

  @ApiProperty({ description: 'Property settings', required: false })
  settings?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}