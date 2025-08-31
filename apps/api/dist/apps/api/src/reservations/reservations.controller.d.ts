import { ReservationsService } from './reservations.service';
import { CreateHoldDto } from './dto/create-hold.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationDto } from './dto/reservation.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    createHold(propertyCode: string, createHoldDto: CreateHoldDto, idempotencyKey: string): Promise<any>;
    createCheckout(propertyCode: string, checkoutDto: CreateCheckoutDto, idempotencyKey: string): Promise<any>;
    confirmPayment(propertyCode: string, confirmDto: ConfirmPaymentDto, idempotencyKey: string): Promise<any>;
    cancelReservation(propertyCode: string, cancelDto: CancelReservationDto): Promise<any>;
    getReservation(propertyCode: string, id: string): Promise<ReservationDto>;
}
