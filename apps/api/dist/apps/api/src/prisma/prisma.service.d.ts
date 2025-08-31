import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '/Users/sanjeev/Downloads/booking_eng/packages/db';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export default PrismaService;
