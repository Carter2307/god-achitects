import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { QueryParkingSpotDto, QueryAvailableSpotsDto } from './dto/query-parking-spot.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ParkingSpotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryParkingSpotDto) {
    const { row, hasElectricCharger, isAvailable } = query;

    const where: Record<string, unknown> = {};
    if (row) where.row = row;
    if (hasElectricCharger !== undefined) where.hasElectricCharger = hasElectricCharger;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    const parkingSpots = await this.prisma.parkingSpot.findMany({
      where,
      orderBy: [{ row: 'asc' }, { spotNumber: 'asc' }],
    });

    return { parkingSpots };
  }

  async findOne(id: string) {
    const parkingSpot = await this.prisma.parkingSpot.findUnique({
      where: { id },
    });

    if (!parkingSpot) {
      throw new NotFoundException('Place de parking non trouvée');
    }

    return { parkingSpot };
  }

  async findAvailable(query: QueryAvailableSpotsDto) {
    const { startDate, endDate, hasElectricCharger } = query;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : start;

    // Reset time to start of day for comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Find spots that have no overlapping reservations
    const reservedSpotIds = await this.prisma.reservation.findMany({
      where: {
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
      select: { parkingSpotId: true },
    });

    const reservedIds = reservedSpotIds.map((r) => r.parkingSpotId);

    const where: Record<string, unknown> = {
      isAvailable: true,
      id: { notIn: reservedIds },
    };

    if (hasElectricCharger !== undefined) {
      where.hasElectricCharger = hasElectricCharger;
    }

    const parkingSpots = await this.prisma.parkingSpot.findMany({
      where,
      orderBy: [{ row: 'asc' }, { spotNumber: 'asc' }],
    });

    return { parkingSpots };
  }

  async create(dto: CreateParkingSpotDto) {
    const existingSpot = await this.prisma.parkingSpot.findUnique({
      where: { spotNumber: dto.spotNumber },
    });

    if (existingSpot) {
      throw new ConflictException('Une place avec ce numéro existe déjà');
    }

    // Auto-set electric charger for rows A and F
    const hasElectricCharger = dto.hasElectricCharger ?? (dto.row === 'A' || dto.row === 'F');

    // Generate QR code
    const qrCode = await this.generateQRCode(dto.spotNumber);

    const parkingSpot = await this.prisma.parkingSpot.create({
      data: {
        ...dto,
        hasElectricCharger,
        qrCode,
      },
    });

    return { parkingSpot };
  }

  async update(id: string, dto: UpdateParkingSpotDto) {
    await this.findOne(id);

    if (dto.spotNumber) {
      const existingSpot = await this.prisma.parkingSpot.findFirst({
        where: {
          spotNumber: dto.spotNumber,
          NOT: { id },
        },
      });

      if (existingSpot) {
        throw new ConflictException('Une place avec ce numéro existe déjà');
      }
    }

    const parkingSpot = await this.prisma.parkingSpot.update({
      where: { id },
      data: dto,
    });

    return { parkingSpot };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.parkingSpot.delete({
      where: { id },
    });

    return { message: 'Place de parking supprimée avec succès' };
  }

  private async generateQRCode(spotNumber: string): Promise<string> {
    const url = `${process.env.APP_URL || 'http://localhost:3000'}/api/checkin/${spotNumber}`;
    return QRCode.toDataURL(url);
  }
}
