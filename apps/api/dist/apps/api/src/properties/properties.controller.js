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
exports.PropertiesController = exports.Req = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const properties_service_1 = require("./properties.service");
const property_dto_1 = require("./dto/property.dto");
const search_availability_dto_1 = require("./dto/search-availability.dto");
const availability_result_dto_1 = require("./dto/availability-result.dto");
const common_2 = require("@nestjs/common");
exports.Req = (0, common_2.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
});
let PropertiesController = class PropertiesController {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    async getAllProperties() {
        return this.propertiesService.findAll();
    }
    async getPropertyByCode(code) {
        return this.propertiesService.findByCode(code);
    }
    async testSearch(request) {
        console.log('Raw request body:', request.body);
        return request.body;
    }
    async searchAvailability(propertyCode, searchParams) {
        return this.propertiesService.searchAvailability(propertyCode, searchParams);
    }
    async getICalExport(propertyCode, unitTypeCode) {
        return this.propertiesService.generateICalExport(propertyCode, unitTypeCode);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all properties' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a list of all properties',
        type: [property_dto_1.PropertyDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getAllProperties", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property by code' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns a property',
        type: property_dto_1.PropertyDto,
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertyByCode", null);
__decorate([
    (0, common_1.Post)('test-search'),
    __param(0, (0, exports.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "testSearch", null);
__decorate([
    (0, common_1.Post)(':propertyCode/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for availability' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns availability for the given dates',
        type: availability_result_dto_1.AvailabilityResultDto,
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_availability_dto_1.SearchAvailabilityDto]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "searchAvailability", null);
__decorate([
    (0, common_1.Get)(':propertyCode/ical/:unitTypeCode.ics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get iCal export for unit type' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns iCal data',
    }),
    __param(0, (0, common_1.Param)('propertyCode')),
    __param(1, (0, common_1.Param)('unitTypeCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getICalExport", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, swagger_1.ApiTags)('properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map