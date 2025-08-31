import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateHoldDto } from './dto/create-hold.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationDto } from './dto/reservation.dto';
export declare class ReservationsService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    createHold(propertyCode: string, dto: CreateHoldDto, idempotencyKey: string): Promise<any>;
    createCheckout(propertyCode: string, dto: CreateCheckoutDto, idempotencyKey: string): Promise<any>;
    confirmPayment(propertyCode: string, dto: ConfirmPaymentDto, idempotencyKey: string): Promise<any>;
    cancelReservation(propertyCode: string, dto: CancelReservationDto): Promise<any>;
    findById(propertyCode: string, id: string): Promise<ReservationDto>;
}
