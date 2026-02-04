import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryHistoryDto, QueryAllHistoryDto } from './dto/query-history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async findUserHistory(userId: string, query: QueryHistoryDto) {
    const { startDate, endDate, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [history, total] = await Promise.all([
      this.prisma.reservationHistory.findMany({
        where,
        skip,
        take: limit,
        include: {
          reservation: {
            include: {
              parkingSpot: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reservationHistory.count({ where }),
    ]);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllHistory(query: QueryAllHistoryDto) {
    const { startDate, endDate, userId, parkingSpotId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (parkingSpotId) where.parkingSpotId = parkingSpotId;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [history, total] = await Promise.all([
      this.prisma.reservationHistory.findMany({
        where,
        skip,
        take: limit,
        include: {
          reservation: {
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true },
              },
              parkingSpot: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reservationHistory.count({ where }),
    ]);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
