import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FindReservationsDto } from './dto/find-reservations.dto';
import { Reservation, Role, Statut, ReservationStatus, MessageType, Prisma, ParkingSpot } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const reservationDate = new Date(dto.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Vérification utilisateur: existe et ACTIF
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${dto.userId} non trouvé`);
    }

    if (user.statut !== Statut.ACTIF) {
      throw new BadRequestException(`L'utilisateur n'est pas actif`);
    }

    // 2. Règle des jours à l'avance selon le rôle
    const maxDaysAdvance = this.getMaxDaysAdvance(user.role);
    const daysUntilReservation = this.getWorkingDaysBetween(today, reservationDate);

    if (daysUntilReservation > maxDaysAdvance) {
      throw new BadRequestException(
        `Un ${user.role} ne peut pas réserver plus de ${maxDaysAdvance} jours ouvrés à l'avance`,
      );
    }

    if (daysUntilReservation < 0) {
      throw new BadRequestException(`Impossible de réserver pour une date passée`);
    }

    // 3. Règle du 11h: empêcher réservation si la place a été libérée après 11h aujourd'hui
    const isToday = this.isSameDay(reservationDate, new Date());
    if (isToday) {
      await this.checkElevenHourRule(dto.parkingSpotId, dto.besoinChargeur);
    }

    // 4. Trouver ou valider la place de parking
    let parkingSpot;
    if (dto.parkingSpotId) {
      // Valider la place fournie
      parkingSpot = await this.prisma.parkingSpot.findUnique({
        where: { id: dto.parkingSpotId },
      });

      if (!parkingSpot) {
        throw new NotFoundException(`Place de parking avec l'ID ${dto.parkingSpotId} non trouvée`);
      }

      // Contrainte électrique
      if (dto.besoinChargeur && !parkingSpot.aChargeurElectrique) {
        throw new BadRequestException(
          `La place ${parkingSpot.numero} ne dispose pas de chargeur électrique`,
        );
      }
    } else {
      // Trouver une place disponible adaptée au besoin de chargeur
      parkingSpot = await this.findAvailableSpot(reservationDate, dto.besoinChargeur);

      if (!parkingSpot) {
        throw new BadRequestException(
          dto.besoinChargeur
            ? `Aucune place avec chargeur électrique disponible pour cette date`
            : `Aucune place disponible pour cette date`,
        );
      }
    }

    // 5. Vérifier la disponibilité de la place pour la date
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        parkingSpotId: parkingSpot.id,
        date: {
          gte: this.startOfDay(reservationDate),
          lt: this.endOfDay(reservationDate),
        },
        statut: {
          in: [ReservationStatus.CONFIRMEE, ReservationStatus.EN_ATTENTE],
        },
      },
    });

    if (existingReservation) {
      throw new BadRequestException(
        `La place ${parkingSpot.numero} est déjà réservée pour cette date`,
      );
    }

    // 6. Transaction atomique: création réservation + historique + message queue
    return this.prisma.$transaction(async (tx) => {
      // Créer la réservation
      const reservation = await tx.reservation.create({
        data: {
          userId: dto.userId,
          parkingSpotId: parkingSpot.id,
          date: reservationDate,
          besoinChargeur: dto.besoinChargeur,
          statut: ReservationStatus.EN_ATTENTE,
        },
        include: {
          user: true,
          parkingSpot: true,
        },
      });

      // Créer l'entrée dans ReservationHistory
      await tx.reservationHistory.create({
        data: {
          reservationId: reservation.id,
          userId: dto.userId,
          action: 'CREATION',
          ancienneValeur: Prisma.JsonNull,
          nouvelleValeur: {
            id: reservation.id,
            parkingSpotId: reservation.parkingSpotId,
            date: reservation.date.toISOString(),
            besoinChargeur: reservation.besoinChargeur,
            statut: reservation.statut,
          },
        },
      });

      // Créer le message dans QueueMessage pour l'envoi du mail
      await tx.queueMessage.create({
        data: {
          reservationId: reservation.id,
          typeMessage: MessageType.CONFIRMATION,
        },
      });

      return reservation;
    });
  }

  async findAll(filters?: FindReservationsDto): Promise<Reservation[]> {
    const where: Prisma.ReservationWhereInput = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.parkingSpotId) {
      where.parkingSpotId = filters.parkingSpotId;
    }

    if (filters?.statut) {
      where.statut = filters.statut;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.date.lte = new Date(filters.dateTo);
      }
    }

    return this.prisma.reservation.findMany({
      where,
      include: {
        user: true,
        parkingSpot: true,
        checkIn: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        parkingSpot: true,
        checkIn: true,
        histories: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    return reservation;
  }

  async findByUser(userId: string, statut?: ReservationStatus): Promise<Reservation[]> {
    const where: Prisma.ReservationWhereInput = { userId };

    if (statut) {
      where.statut = statut;
    }

    return this.prisma.reservation.findMany({
      where,
      include: {
        parkingSpot: true,
        checkIn: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getAvailability(
    date: Date,
    besoinChargeur?: boolean,
  ): Promise<{ available: ParkingSpot[]; total: number; withCharger: number }> {
    const startOfDay = this.startOfDay(date);
    const endOfDay = this.endOfDay(date);

    // Récupérer toutes les places avec leurs réservations pour cette date
    const allSpots = await this.prisma.parkingSpot.findMany({
      include: {
        reservations: {
          where: {
            date: {
              gte: startOfDay,
              lt: endOfDay,
            },
            statut: {
              in: [ReservationStatus.CONFIRMEE, ReservationStatus.EN_ATTENTE],
            },
          },
        },
      },
    });

    // Filtrer les places disponibles (sans réservation active)
    let availableSpots = allSpots.filter((spot) => spot.reservations.length === 0);

    // Si besoinChargeur est spécifié, filtrer en conséquence
    if (besoinChargeur !== undefined) {
      availableSpots = availableSpots.filter(
        (spot) => spot.aChargeurElectrique === besoinChargeur,
      );
    }

    // Calculer les statistiques
    const withCharger = availableSpots.filter((spot) => spot.aChargeurElectrique).length;

    // Retirer les réservations des objets retournés pour une réponse plus propre
    const cleanSpots = availableSpots.map(({ reservations, ...spot }) => spot) as ParkingSpot[];

    return {
      available: cleanSpots,
      total: cleanSpots.length,
      withCharger,
    };
  }

  private getMaxDaysAdvance(role: Role): number {
    switch (role) {
      case Role.GESTIONNAIRE:
        return 30;
      case Role.EMPLOYE:
      case Role.SECRETAIRE:
      default:
        return 5;
    }
  }

  private getWorkingDaysBetween(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current < end) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
    }

    return count;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private async checkElevenHourRule(
    parkingSpotId: string | undefined,
    besoinChargeur: boolean,
  ): Promise<void> {
    const now = new Date();
    const today = this.startOfDay(new Date());
    const elevenAM = new Date(today);
    elevenAM.setHours(11, 0, 0, 0);

    // Si on est avant 11h, pas de restriction
    if (now < elevenAM) {
      return;
    }

    // Chercher les réservations annulées après 11h aujourd'hui
    const cancelledAfterEleven = await this.prisma.reservationHistory.findMany({
      where: {
        action: 'ANNULATION',
        dateHeure: {
          gte: elevenAM,
          lt: this.endOfDay(today),
        },
        reservation: {
          date: {
            gte: today,
            lt: this.endOfDay(today),
          },
          ...(parkingSpotId ? { parkingSpotId } : {}),
          ...(besoinChargeur ? { parkingSpot: { aChargeurElectrique: true } } : {}),
        },
      },
      include: {
        reservation: true,
      },
    });

    if (cancelledAfterEleven.length > 0) {
      // Vérifier si ces places ont déjà été reprises
      for (const history of cancelledAfterEleven) {
        const spotId = history.reservation.parkingSpotId;

        // Si une place spécifique est demandée et qu'elle a été libérée après 11h
        if (parkingSpotId && spotId === parkingSpotId) {
          throw new BadRequestException(
            `Cette place a été libérée après 11h aujourd'hui et ne peut plus être réservée pour aujourd'hui`,
          );
        }
      }
    }
  }

  private async findAvailableSpot(
    date: Date,
    besoinChargeur: boolean,
  ) {
    const startOfDay = this.startOfDay(date);
    const endOfDay = this.endOfDay(date);

    // Trouver toutes les places avec les réservations pour cette date
    const spots = await this.prisma.parkingSpot.findMany({
      where: {
        ...(besoinChargeur ? { aChargeurElectrique: true } : {}),
      },
      include: {
        reservations: {
          where: {
            date: {
              gte: startOfDay,
              lt: endOfDay,
            },
            statut: {
              in: [ReservationStatus.CONFIRMEE, ReservationStatus.EN_ATTENTE],
            },
          },
        },
      },
    });

    // Retourner la première place sans réservation active pour cette date
    return spots.find((spot) => spot.reservations.length === 0) || null;
  }
}
