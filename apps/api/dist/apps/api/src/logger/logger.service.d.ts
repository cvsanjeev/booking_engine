export declare class LoggerService {
    private logger;
    constructor();
    log(message: string, context?: any): void;
    error(message: string, context?: any): void;
    warn(message: string, context?: any): void;
    debug(message: string, context?: any): void;
}
