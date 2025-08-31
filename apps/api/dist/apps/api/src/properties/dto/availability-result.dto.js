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
exports.AvailabilityResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UnitTypeAvailabilityDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit type ID' }),
    __metadata("design:type", String)
], UnitTypeAvailabilityDto.prototype, "unitTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit type code' }),
    __metadata("design:type", String)
], UnitTypeAvailabilityDto.prototype, "unitTypeCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit type name' }),
    __metadata("design:type", String)
], UnitTypeAvailabilityDto.prototype, "unitTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base rate per night (in smallest currency unit)' }),
    __metadata("design:type", Number)
], UnitTypeAvailabilityDto.prototype, "baseRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the unit type is available' }),
    __metadata("design:type", Boolean)
], UnitTypeAvailabilityDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of available units' }),
    __metadata("design:type", Number)
], UnitTypeAvailabilityDto.prototype, "availableUnits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total units of this type' }),
    __metadata("design:type", Number)
], UnitTypeAvailabilityDto.prototype, "totalUnits", void 0);
class AvailabilityResultDto {
}
exports.AvailabilityResultDto = AvailabilityResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-in date (ISO string)' }),
    __metadata("design:type", String)
], AvailabilityResultDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Check-out date (ISO string)' }),
    __metadata("design:type", String)
], AvailabilityResultDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of nights' }),
    __metadata("design:type", Number)
], AvailabilityResultDto.prototype, "nights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available unit types', type: [UnitTypeAvailabilityDto] }),
    __metadata("design:type", Array)
], AvailabilityResultDto.prototype, "unitTypes", void 0);
//# sourceMappingURL=availability-result.dto.js.map