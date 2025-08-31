import { 
  Controller, 
  Get, 
  Post, 
  Param,
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertyDto } from './dto/property.dto';
import { SearchAvailabilityDto } from './dto/search-availability.dto';
import { AvailabilityResultDto } from './dto/availability-result.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';



export const Req = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  },
);
@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all properties',
    type: [PropertyDto],
  })
  async getAllProperties(): Promise<PropertyDto[]> {
    return this.propertiesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get property by code' })
  @ApiResponse({
    status: 200,
    description: 'Returns a property',
    type: PropertyDto,
  })
  async getPropertyByCode(@Param('code') code: string): Promise<PropertyDto> {
    return this.propertiesService.findByCode(code);
  }
  @Post('test-search')
async testSearch(@Req() request) {
  console.log('Raw request body:', request.body);
  return request.body;
}
  @Post(':propertyCode/search')
  @ApiOperation({ summary: 'Search for availability' })
  @ApiResponse({
    status: 200, 
    description: 'Returns availability for the given dates',
    type: AvailabilityResultDto,
  })
  async searchAvailability(
    @Param('propertyCode') propertyCode: string,
    @Body() searchParams: SearchAvailabilityDto,
  ): Promise<AvailabilityResultDto> {
    return this.propertiesService.searchAvailability(propertyCode, searchParams);
  }
  
  @Get(':propertyCode/ical/:unitTypeCode.ics')
  @ApiOperation({ summary: 'Get iCal export for unit type' })
  @ApiResponse({
    status: 200,
    description: 'Returns iCal data',
  })
  async getICalExport(
    @Param('propertyCode') propertyCode: string,
    @Param('unitTypeCode') unitTypeCode: string,
  ): Promise<string> {
    return this.propertiesService.generateICalExport(propertyCode, unitTypeCode);
  }
}

