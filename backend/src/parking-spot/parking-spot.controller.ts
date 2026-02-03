import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParkingSpotService } from './parking-spot.service';

@Controller('parking-spots')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('chargerRequired') chargerRequired?: string,
  ) {
    const needsCharger = chargerRequired === 'true';
    return this.parkingSpotService.findAll(date, needsCharger || undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingSpotService.findOne(id);
  }
}
