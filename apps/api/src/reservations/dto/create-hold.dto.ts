import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHoldDto {
  @ApiProperty({ description: 'Unit type code' })
  @IsString()
  unitTypeCode: string;

  @ApiProperty({ description: 'Check-in date (YYYY-MM-DD)' })
  @IsString()
  checkIn: string;

  @ApiProperty({ description: 'Check-out date (YYYY-MM-DD)' })
  @IsString()
  checkOut: string;

  @ApiProperty({ description: 'Number of guests', minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  guests: number;

  @ApiProperty({ description: 'Rate plan code', required: false })
  @IsOptional()
  @IsString()
  ratePlanCode?: string;
}