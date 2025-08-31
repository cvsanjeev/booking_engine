declare class UnitTypeAvailabilityDto {
    unitTypeId: string;
    unitTypeCode: string;
    unitTypeName: string;
    baseRate: number;
    available: boolean;
    availableUnits: number;
    totalUnits: number;
}
export declare class AvailabilityResultDto {
    checkIn: string;
    checkOut: string;
    nights: number;
    unitTypes: UnitTypeAvailabilityDto[];
}
export {};
