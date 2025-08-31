import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchAvailabilityDto {
  @ApiProperty({ description: 'Check-in date (YYYY-MM-DD)' })
  @IsString()
  checkIn: string;

  @ApiProperty({ description: 'Check-out date (YYYY-MM-DD)' })
  @IsString()
  checkOut: string;

  @ApiProperty({ description: 'Number of guests', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests: number;

  @ApiProperty({ description: 'Unit types to filter by', required: false })
  @IsOptional()
  @IsArray()
  @Type(() => String) 
  unitTypes?: string[];
}