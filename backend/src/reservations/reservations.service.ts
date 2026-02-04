import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { differenceInDays, startOfDay } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { QueryReservationDto, QueryAllReservationsDto } from './dto/query-reservation.dto';
import { Role, ReservationStatus, EmailMessageType } from '@prisma/client';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async findUserReservations(userId: string, query: QueryReservationDto) {
    const { status, startDate, endDate } = query;

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const reservations = await this.prisma.reservation.findMany({
      where,
      include: {
        parkingSpot: true,
        checkIn: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return { reservations };
  }

  async findAllReservations(query: QueryAllReservationsDto) {
    const { status, startDate, endDate, userId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          parkingSpot: true,
          checkIn: true,
        },
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
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

    return { reservation };
  }

  async create(dto: CreateReservationDto, user: AuthenticatedUser) {
    const startDate = startOfDay(new Date(dto.startDate));
    const endDate = startOfDay(new Date(dto.endDate));
    const today = startOfDay(new Date());

    // Validate dates
    if (startDate < today) {
      throw new BadRequestException('La date de début ne peut pas être dans le passé');
    }

    if (endDate < startDate) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    // Validate duration based on role
    const duration = differenceInDays(endDate, startDate) + 1;
    const maxDays = user.role === Role.MANAGER ? 30 : 5;

    if (duration > maxDays) {
      throw new BadRequestException(
        `La durée maximale de réservation est de ${maxDays} jours pour votre rôle`,
      );
    }

    // Check if parking spot exists
    const parkingSpot = await this.prisma.parkingSpot.findUnique({
      where: { id: dto.parkingSpotId },
    });

    if (!parkingSpot) {
      throw new NotFoundException('Place de parking non trouvée');
    }

    if (!parkingSpot.isAvailable) {
      throw new BadRequestException('Cette place de parking n\'est pas disponible');
    }

    // Check for overlapping reservations
    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        parkingSpotId: dto.parkingSpotId,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    if (overlapping) {
      throw new BadRequestException('Cette place est déjà réservée pour cette période');
    }

    // Create reservation
    const reservation = await this.prisma.reservation.create({
      data: {
        userId: user.id,
        parkingSpotId: dto.parkingSpotId,
        startDate,
        endDate,
        status: ReservationStatus.PENDING,
      },
      include: {
        parkingSpot: true,
      },
    });

    // Add to email queue
    await this.prisma.emailQueue.create({
      data: {
        reservationId: reservation.id,
        recipientEmail: user.email,
        messageType: EmailMessageType.RESERVATION_CONFIRMATION,
      },
    });

    // Create history entry
    await this.prisma.reservationHistory.create({
      data: {
        reservationId: reservation.id,
        userId: user.id,
        parkingSpotId: dto.parkingSpotId,
        startDate,
        endDate,
        status: ReservationStatus.PENDING,
      },
    });

    return { reservation };
  }

  async update(id: string, dto: UpdateReservationDto) {
    const existing = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Réservation non trouvée');
    }

    const data: Record<string, unknown> = { ...dto };

    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }

    // If changing parking spot, check availability
    if (dto.parkingSpotId && dto.parkingSpotId !== existing.parkingSpotId) {
      const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
      const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

      const overlapping = await this.prisma.reservation.findFirst({
        where: {
          parkingSpotId: dto.parkingSpotId,
          status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
          NOT: { id },
        },
      });

      if (overlapping) {
        throw new BadRequestException('Cette place est déjà réservée pour cette période');
      }
    }

    const reservation = await this.prisma.reservation.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        parkingSpot: true,
        checkIn: true,
      },
    });

    // Update history
    await this.prisma.reservationHistory.update({
      where: { reservationId: id },
      data: {
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
      },
    });

    return { reservation };
  }

  async cancel(id: string, user: AuthenticatedUser) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Check access: owner or secretary
    if (reservation.userId !== user.id && user.role !== Role.SECRETARY) {
      throw new ForbiddenException('Accès non autorisé à cette réservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cette réservation est déjà annulée');
    }

    await this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });

    // Update history
    await this.prisma.reservationHistory.update({
      where: { reservationId: id },
      data: { status: ReservationStatus.CANCELLED },
    });

    // Add cancellation email to queue
    const reservationUser = await this.prisma.user.findUnique({
      where: { id: reservation.userId },
      select: { email: true },
    });

    if (reservationUser) {
      await this.prisma.emailQueue.create({
        data: {
          reservationId: id,
          recipientEmail: reservationUser.email,
          messageType: EmailMessageType.RESERVATION_CANCELLED,
        },
      });
    }

    return { message: 'Réservation annulée avec succès' };
  }
}
