import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, BadRequestException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  async findByUser(@Query('userId') userId?: string) {
    if (!userId) {
      throw new BadRequestException('Parameter userId is required');
    }
    return this.reservationService.findByUser(userId);
  }
}
