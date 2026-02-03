import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FindReservationsDto } from './dto/find-reservations.dto';
import { ReservationStatus } from '@prisma/client';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(@Query() filters: FindReservationsDto) {
    return this.reservationService.findAll(filters);
  }

  @Get('availability/:date')
  getAvailability(
    @Param('date') date: string,
    @Query('besoinChargeur') besoinChargeur?: string,
  ) {
    const parsedDate = new Date(date);
    const needCharger = besoinChargeur === 'true' ? true : besoinChargeur === 'false' ? false : undefined;
    return this.reservationService.getAvailability(parsedDate, needCharger);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('statut') statut?: ReservationStatus,
  ) {
    return this.reservationService.findByUser(userId, statut);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }
}
