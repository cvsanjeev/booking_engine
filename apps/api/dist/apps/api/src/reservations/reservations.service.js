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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let ReservationsService = class ReservationsService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async createHold(propertyCode, dto, idempotencyKey) {
        return {
            id: 'sample-hold-id',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            unitTypeCode: dto.unitTypeCode,
            checkIn: dto.checkIn,
            checkOut: dto.checkOut,
            guests: dto.guests,
        };
    }
    async createCheckout(propertyCode, dto, idempotencyKey) {
        return {
            reservationId: 'sample-reservation-id',
            razorpayOrderId: 'sample-razorpay-order-id',
            amount: 299900,
            currency: 'INR',
        };
    }
    async confirmPayment(propertyCode, dto, idempotencyKey) {
        return {
            status: 'CONFIRMED',
            reservationId: dto.reservationId,
            paymentId: dto.razorpayPaymentId,
        };
    }
    async cancelReservation(propertyCode, dto) {
        return {
            status: 'CANCELLED',
            reservationId: dto.reservationId,
            refundAmount: 0,
        };
    }
    async findById(propertyCode, id) {
        const reservation = {
            id,
            propertyId: 'sample-property-id',
            unitTypeId: 'sample-unit-type-id',
            status: 'CONFIRMED',
            checkIn: new Date('2025-01-15'),
            checkOut: new Date('2025-01-20'),
            adults: 2,
            children: 0,
            subtotal: 1499500,
            tax: 269910,
            fees: 50000,
            discount: 0,
            total: 1819410,
            currency: 'INR',
            customerEmail: 'guest@example.com',
            customerName: 'John Doe',
            razorpayOrderId: 'order_sample',
            razorpayPaymentId: 'pay_sample',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return reservation;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map