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
exports.PropertyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PropertyDto {
}
exports.PropertyDto = PropertyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property ID' }),
    __metadata("design:type", String)
], PropertyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property code' }),
    __metadata("design:type", String)
], PropertyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property name' }),
    __metadata("design:type", String)
], PropertyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property address', required: false }),
    __metadata("design:type", String)
], PropertyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property city', required: false }),
    __metadata("design:type", String)
], PropertyDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property state', required: false }),
    __metadata("design:type", String)
], PropertyDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property country', required: false }),
    __metadata("design:type", String)
], PropertyDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property timezone', default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], PropertyDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property currency', default: 'INR' }),
    __metadata("design:type", String)
], PropertyDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property settings', required: false }),
    __metadata("design:type", Object)
], PropertyDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], PropertyDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], PropertyDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=property.dto.js.map