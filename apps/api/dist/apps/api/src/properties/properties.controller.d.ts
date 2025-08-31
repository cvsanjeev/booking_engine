import { PropertiesService } from './properties.service';
import { PropertyDto } from './dto/property.dto';
import { SearchAvailabilityDto } from './dto/search-availability.dto';
import { AvailabilityResultDto } from './dto/availability-result.dto';
export declare const Req: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    getAllProperties(): Promise<PropertyDto[]>;
    getPropertyByCode(code: string): Promise<PropertyDto>;
    testSearch(request: any): Promise<any>;
    searchAvailability(propertyCode: string, searchParams: SearchAvailabilityDto): Promise<AvailabilityResultDto>;
    getICalExport(propertyCode: string, unitTypeCode: string): Promise<string>;
}
