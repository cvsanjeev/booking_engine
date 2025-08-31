"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let PropertiesService = class PropertiesService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll() {
        return this.prisma.property.findMany();
    }
    async findByCode(code) {
        const property = await this.prisma.property.findUnique({
            where: { code },
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with code ${code} not found`);
        }
        return property;
    }
    async searchAvailability(propertyCode, params) {
        const property = await this.findByCode(propertyCode);
        return {
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            nights: 1,
            unitTypes: [
                {
                    unitTypeId: 'sample-id',
                    unitTypeCode: '1A',
                    unitTypeName: 'Studio Apartment',
                    baseRate: 299900,
                    available: true,
                    availableUnits: 4,
                    totalUnits: 4,
                },
            ],
        };
    }
    async generateICalExport(propertyCode, unitTypeCode) {
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Service Apartments//Booking Engine//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:sample-reservation-1
SUMMARY:Sample Reservation
DTSTART:20250101T140000Z
DTEND:20250103T110000Z
DESCRIPTION:Sample reservation for demo purposes
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map