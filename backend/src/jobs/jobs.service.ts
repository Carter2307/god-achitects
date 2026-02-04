import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfDay, endOfDay } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus, EmailMessageType, EmailStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 11 * * *', {
    name: 'expire-reservations',
    timeZone: 'Europe/Paris',
  })
  async expireUnconfirmedReservations() {
    this.logger.log('Running reservation expiration job...');

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Find all pending reservations for today without check-in
    const pendingReservations = await this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        startDate: { lte: endOfToday },
        endDate: { gte: startOfToday },
        checkIn: null,
      },
      include: {
        user: { select: { email: true } },
      },
    });

    this.logger.log(`Found ${pendingReservations.length} reservations to expire`);

    for (const reservation of pendingReservations) {
      try {
        // Update reservation status to expired
        await this.prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: ReservationStatus.EXPIRED },
        });

        // Update history
        await this.prisma.reservationHistory.update({
          where: { reservationId: reservation.id },
          data: { status: ReservationStatus.EXPIRED },
        });

        // Send expiration email
        await this.prisma.emailQueue.create({
          data: {
            reservationId: reservation.id,
            recipientEmail: reservation.user.email,
            messageType: EmailMessageType.RESERVATION_EXPIRED,
            status: EmailStatus.PENDING,
          },
        });

        this.logger.log(`Expired reservation ${reservation.id}`);
      } catch (error) {
        this.logger.error(`Failed to expire reservation ${reservation.id}:`, error);
      }
    }

    this.logger.log('Reservation expiration job completed');
    return { expiredCount: pendingReservations.length };
  }

  // Manual trigger endpoint for testing
  async manualExpireReservations() {
    return this.expireUnconfirmedReservations();
  }
}
