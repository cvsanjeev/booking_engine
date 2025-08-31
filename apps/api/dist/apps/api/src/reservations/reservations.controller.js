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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reservations_service_1 = require("./reservations.service");
const create_hold_dto_1 = require("./dto/create-hold.dto");
const create_checkout_dto_1 = require("./dto/create-checkout.dto");
const confirm_payment_dto_1 = require("./dto/confirm-payment.dto");
const cancel_reservation_dto_1 = require("./dto/cancel-reservation.dto");
const reservation_dto_1 = require("./dto/reservation.dto");
const idempotency_key_guard_1 = require("../guards/idempotency-key.guard");
let ReservationsController = class ReservationsController {
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async createHold(propertyCode, createHoldDto, idempotencyKey) {
        return this.reservationsService.createHold(propertyCode, createHoldDto, idempotencyKey);
    }
    async createCheckout(propertyCode, checkoutDto, idempotencyKey) {
        return this.reservationsService.createCheckout(propertyCode, checkoutDto, idempotencyKey);
    }
    async confirmPayment(propertyCode, confirmDto, idempotencyKey) {
        return this.reservationsService.confirmPayment(propertyCode, confirmDto, idempotencyKey);
    }
    async cancelReservation(propertyCode, cancelDto) {
        return this.reservationsService.cancelReservation(propertyCode, cancelDto);
    }
    async getReservation(propertyCode, id) {
        return this.reservationsService.findById(propertyCode, id);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)('hold'),
    (0, common_1.UseGuards)(idempotency_key_guard_1.IdempotencyKeyGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reservation hold' }),
    (0, swagger_1.ApiHeader)({
        name: 'Idempotency-Key',
        description: 'Unique key to prevent duplicate requests',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Hold created successfully',
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_hold_dto_1.CreateHoldDto, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createHold", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(idempotency_key_guard_1.IdempotencyKeyGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment checkout' }),
    (0, swagger_1.ApiHeader)({
        name: 'Idempotency-Key',
        description: 'Unique key to prevent duplicate requests',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checkout created successfully',
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_checkout_dto_1.CreateCheckoutDto, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(idempotency_key_guard_1.IdempotencyKeyGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm reservation payment' }),
    (0, swagger_1.ApiHeader)({
        name: 'Idempotency-Key',
        description: 'Unique key to prevent duplicate requests',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payment confirmed successfully',
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirm_payment_dto_1.ConfirmPaymentDto, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)('cancel'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel reservation' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reservation cancelled successfully',
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_reservation_dto_1.CancelReservationDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "cancelReservation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reservation by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns reservation details',
        type: reservation_dto_1.ReservationDto,
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getReservation", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('reservations'),
    (0, common_1.Controller)(':propertyCode/reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map