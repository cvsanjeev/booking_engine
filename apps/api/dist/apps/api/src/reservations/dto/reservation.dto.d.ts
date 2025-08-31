export declare class ReservationDto {
    id: string;
    propertyId: string;
    unitTypeId: string;
    unitId?: string;
    status: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children?: number;
    subtotal: number;
    tax: number;
    fees: number;
    discount: number;
    total: number;
    currency: string;
    customerEmail: string;
    customerName?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
