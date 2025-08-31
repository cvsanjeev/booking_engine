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
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = require("crypto");
let RazorpayService = class RazorpayService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    verifyWebhookSignature(payload, signature) {
        try {
            const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(payload)
                .digest('hex');
            return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
        }
        catch (error) {
            return false;
        }
    }
    async processWebhookEvent(payload) {
        const { event, payload: eventPayload } = payload;
        switch (event) {
            case 'payment.authorized':
                break;
            case 'payment.captured':
                break;
            case 'payment.failed':
                break;
            case 'refund.processed':
                break;
            default:
        }
        return { received: true };
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map