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
exports.ReservationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReservationDto {
}
exports.ReservationDto = ReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reservation ID' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property ID' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "propertyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit type ID' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "unitTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit ID', required: false }),
    __metadata("design:type", String)
], ReservationDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reservation status' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-in date' }),
    __metadata("design:type", Date)
], ReservationDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-out date' }),
    __metadata("design:type", Date)
], ReservationDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of adult guests' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "adults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of child guests', required: false }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subtotal amount (in smallest currency unit)' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tax amount (in smallest currency unit)' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fees amount (in smallest currency unit)' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "fees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount amount (in smallest currency unit)' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount (in smallest currency unit)' }),
    __metadata("design:type", Number)
], ReservationDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer email' }),
    __metadata("design:type", String)
], ReservationDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name', required: false }),
    __metadata("design:type", String)
], ReservationDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razorpay order ID', required: false }),
    __metadata("design:type", String)
], ReservationDto.prototype, "razorpayOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razorpay payment ID', required: false }),
    __metadata("design:type", String)
], ReservationDto.prototype, "razorpayPaymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ReservationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], ReservationDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=reservation.dto.js.map