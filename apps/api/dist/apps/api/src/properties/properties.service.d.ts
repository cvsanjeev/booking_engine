import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PropertyDto } from './dto/property.dto';
import { SearchAvailabilityDto } from './dto/search-availability.dto';
import { AvailabilityResultDto } from './dto/availability-result.dto';
export declare class PropertiesService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(): Promise<PropertyDto[]>;
    findByCode(code: string): Promise<PropertyDto>;
    searchAvailability(propertyCode: string, params: SearchAvailabilityDto): Promise<AvailabilityResultDto>;
    generateICalExport(propertyCode: string, unitTypeCode: string): Promise<string>;
}
