import { PrismaService } from '../../prisma/prisma.service';
export declare class RazorpayService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    verifyWebhookSignature(payload: string, signature: string): boolean;
    processWebhookEvent(payload: any): Promise<any>;
}
