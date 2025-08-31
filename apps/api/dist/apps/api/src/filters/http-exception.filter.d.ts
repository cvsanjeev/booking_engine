import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: LoggerService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
