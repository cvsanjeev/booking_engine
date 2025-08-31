import { RazorpayService } from './razorpay.service';
export declare class RazorpayWebhookController {
    private readonly razorpayService;
    constructor(razorpayService: RazorpayService);
    handleWebhook(signature: string, payload: any): Promise<any>;
}
