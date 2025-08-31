import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  HttpCode, 
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateHoldDto } from './dto/create-hold.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationDto } from './dto/reservation.dto';
import { IdempotencyKeyGuard } from '../guards/idempotency-key.guard';

@ApiTags('reservations')
@Controller(':propertyCode/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('hold')
  @UseGuards(IdempotencyKeyGuard)
  @ApiOperation({ summary: 'Create a reservation hold' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key to prevent duplicate requests',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Hold created successfully',
  })
  async createHold(
    @Param('propertyCode') propertyCode: string,
    @Body() createHoldDto: CreateHoldDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<any> {
    return this.reservationsService.createHold(
      propertyCode,
      createHoldDto,
      idempotencyKey,
    );
  }

  @Post('checkout')
  @UseGuards(IdempotencyKeyGuard)
  @ApiOperation({ summary: 'Create payment checkout' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key to prevent duplicate requests',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout created successfully',
  })
  async createCheckout(
    @Param('propertyCode') propertyCode: string,
    @Body() checkoutDto: CreateCheckoutDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<any> {
    return this.reservationsService.createCheckout(
      propertyCode,
      checkoutDto,
      idempotencyKey,
    );
  }

  @Post('confirm')
  @HttpCode(200)
  @UseGuards(IdempotencyKeyGuard)
  @ApiOperation({ summary: 'Confirm reservation payment' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key to prevent duplicate requests',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
  })
  async confirmPayment(
    @Param('propertyCode') propertyCode: string,
    @Body() confirmDto: ConfirmPaymentDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<any> {
    return this.reservationsService.confirmPayment(
      propertyCode,
      confirmDto,
      idempotencyKey,
    );
  }

  @Post('cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
  })
  async cancelReservation(
    @Param('propertyCode') propertyCode: string,
    @Body() cancelDto: CancelReservationDto,
  ): Promise<any> {
    return this.reservationsService.cancelReservation(propertyCode, cancelDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns reservation details',
    type: ReservationDto,
  })
  async getReservation(
    @Param('propertyCode') propertyCode: string,
    @Param('id') id: string,
  ): Promise<ReservationDto> {
    return this.reservationsService.findById(propertyCode, id);
  }
}