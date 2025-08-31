import { ApiProperty } from '@nestjs/swagger';

class UnitTypeAvailabilityDto {
  @ApiProperty({ description: 'Unit type ID' })
  unitTypeId: string;

  @ApiProperty({ description: 'Unit type code' })
  unitTypeCode: string;

  @ApiProperty({ description: 'Unit type name' })
  unitTypeName: string;

  @ApiProperty({ description: 'Base rate per night (in smallest currency unit)' })
  baseRate: number;

  @ApiProperty({ description: 'Whether the unit type is available' })
  available: boolean;

  @ApiProperty({ description: 'Number of available units' })
  availableUnits: number;

  @ApiProperty({ description: 'Total units of this type' })
  totalUnits: number;
}

export class AvailabilityResultDto {
  @ApiProperty({ description: 'Check-in date (ISO string)' })
  checkIn: string;

  @ApiProperty({ description: 'Check-out date (ISO string)' })
  checkOut: string;

  @ApiProperty({ description: 'Number of nights' })
  nights: number;

  @ApiProperty({ description: 'Available unit types', type: [UnitTypeAvailabilityDto] })
  unitTypes: UnitTypeAvailabilityDto[];
}