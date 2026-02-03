import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user.module';
import { ReservationModule } from './reservation/reservation.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ReservationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}