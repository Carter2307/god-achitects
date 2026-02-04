import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { startOfDay, endOfDay } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ReservationStatus } from '@prisma/client';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async checkInBySpotNumber(spotNumber: string, user: AuthenticatedUser) {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Find the parking spot
    const parkingSpot = await this.prisma.parkingSpot.findUnique({
      where: { spotNumber },
    });

    if (!parkingSpot) {
      throw new NotFoundException('Place de parking non trouvée');
    }

    // Find active reservation for this user and spot today
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        userId: user.id,
        parkingSpotId: parkingSpot.id,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        startDate: { lte: endOfToday },
        endDate: { gte: startOfToday },
      },
      include: {
        parkingSpot: true,
        checkIn: true,
      },
    });

    if (!reservation) {
      throw new BadRequestException(
        'Aucune réservation active trouvée pour cette place aujourd\'hui',
      );
    }

    if (reservation.checkIn) {
      throw new BadRequestException('Vous avez déjà effectué le check-in pour cette réservation');
    }

    // Create check-in
    const checkIn = await this.prisma.checkIn.create({
      data: {
        reservationId: reservation.id,
        checkInTime: today,
      },
    });

    // Update reservation status to confirmed
    await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CONFIRMED },
    });

    // Update history
    await this.prisma.reservationHistory.update({
      where: { reservationId: reservation.id },
      data: {
        status: ReservationStatus.CONFIRMED,
        checkInTime: today,
      },
    });

    const updatedReservation = await this.prisma.reservation.findUnique({
      where: { id: reservation.id },
      include: {
        parkingSpot: true,
        checkIn: true,
      },
    });

    return { checkIn, reservation: updatedReservation };
  }

  async checkInByReservationId(reservationId: string, user: AuthenticatedUser) {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        parkingSpot: true,
        checkIn: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Check access: owner or secretary
    if (reservation.userId !== user.id && user.role !== Role.SECRETARY) {
      throw new ForbiddenException('Accès non autorisé à cette réservation');
    }

    // Check if reservation is for today
    const reservationStart = startOfDay(reservation.startDate);
    const reservationEnd = endOfDay(reservation.endDate);

    if (today < reservationStart || today > reservationEnd) {
      throw new BadRequestException(
        'Le check-in n\'est possible que pendant la période de réservation',
      );
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cette réservation a été annulée');
    }

    if (reservation.status === ReservationStatus.EXPIRED) {
      throw new BadRequestException('Cette réservation a expiré');
    }

    if (reservation.checkIn) {
      throw new BadRequestException('Le check-in a déjà été effectué pour cette réservation');
    }

    // Create check-in
    const checkIn = await this.prisma.checkIn.create({
      data: {
        reservationId: reservation.id,
        checkInTime: today,
      },
    });

    // Update reservation status to confirmed
    await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CONFIRMED },
    });

    // Update history
    await this.prisma.reservationHistory.update({
      where: { reservationId: reservation.id },
      data: {
        status: ReservationStatus.CONFIRMED,
        checkInTime: today,
      },
    });

    const updatedReservation = await this.prisma.reservation.findUnique({
      where: { id: reservation.id },
      include: {
        parkingSpot: true,
        checkIn: true,
      },
    });

    return { checkIn, reservation: updatedReservation };
  }
}
