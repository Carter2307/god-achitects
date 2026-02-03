import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ParkingSpotService {
  constructor(private prisma: PrismaService) {}

  async findAll(date?: string, chargerRequired?: boolean) {
    const spots = await this.prisma.parkingSpot.findMany({
      where: chargerRequired ? { aChargeurElectrique: true } : undefined,
      orderBy: [{ rangee: 'asc' }, { numero: 'asc' }],
    });

    // Si une date est fournie, vérifier la disponibilité pour cette date
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Récupérer les réservations actives pour cette date
      const reservations = await this.prisma.reservation.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          statut: {
            in: [ReservationStatus.EN_ATTENTE, ReservationStatus.CONFIRMEE],
          },
        },
        select: {
          parkingSpotId: true,
        },
      });

      const reservedSpotIds = new Set(reservations.map((r) => r.parkingSpotId));

      // Transformer les spots avec leur disponibilité
      return spots.map((spot) => ({
        id: spot.id,
        numero: spot.numero,
        rangee: spot.rangee,
        aChargeurElectrique: spot.aChargeurElectrique,
        statut: reservedSpotIds.has(spot.id) ? 'RESERVEE' : 'DISPONIBLE',
        qrCodeUrl: spot.qrCodeUrl,
      }));
    }

    return spots;
  }

  async findOne(id: string) {
    return this.prisma.parkingSpot.findUnique({
      where: { id },
    });
  }
}
