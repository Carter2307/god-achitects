import { Module } from '@nestjs/common';
import { ParkingSpotsController } from './parking-spots.controller';
import { ParkingSpotsService } from './parking-spots.service';

@Module({
  controllers: [ParkingSpotsController],
  providers: [ParkingSpotsService],
  exports: [ParkingSpotsService],
})
export class ParkingSpotsModule {}
