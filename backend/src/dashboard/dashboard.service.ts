import { Injectable } from '@nestjs/common';
import { startOfDay, endOfDay, eachDayOfInterval, differenceInDays } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDashboardDto, QueryPopularSpotsDto } from './dto/query-dashboard.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(query: QueryDashboardDto) {
    const now = new Date();
    const startDate = query.startDate ? startOfDay(new Date(query.startDate)) : startOfDay(now);
    const endDate = query.endDate ? endOfDay(new Date(query.endDate)) : endOfDay(now);

    // Total reservations in period
    const totalReservations = await this.prisma.reservation.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // Confirmed reservations (with check-in)
    const confirmedReservations = await this.prisma.reservation.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: ReservationStatus.CONFIRMED,
      },
    });

    // Expired/No-show reservations
    const expiredReservations = await this.prisma.reservation.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: ReservationStatus.EXPIRED,
      },
    });

    // Total parking spots
    const totalSpots = await this.prisma.parkingSpot.count();

    // Electric charger spots
    const electricSpots = await this.prisma.parkingSpot.count({
      where: { hasElectricCharger: true },
    });

    // Reservations on electric charger spots
    const electricReservations = await this.prisma.reservation.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        parkingSpot: { hasElectricCharger: true },
      },
    });

    // Calculate average reservation duration
    const reservationsWithDuration = await this.prisma.reservation.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const averageReservationDuration =
      reservationsWithDuration.length > 0
        ? reservationsWithDuration.reduce((acc, r) => {
            return acc + differenceInDays(r.endDate, r.startDate) + 1;
          }, 0) / reservationsWithDuration.length
        : 0;

    // Calculate occupancy rate
    const days = differenceInDays(endDate, startDate) + 1;
    const totalSlots = totalSpots * days;
    const occupancyRate = totalSlots > 0 ? (totalReservations / totalSlots) * 100 : 0;

    // No-show rate
    const completedReservations = confirmedReservations + expiredReservations;
    const noShowRate =
      completedReservations > 0 ? (expiredReservations / completedReservations) * 100 : 0;

    // Electric charger usage rate
    const electricChargerUsageRate =
      totalReservations > 0 ? (electricReservations / totalReservations) * 100 : 0;

    return {
      totalReservations,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      noShowRate: Math.round(noShowRate * 10) / 10,
      electricChargerUsageRate: Math.round(electricChargerUsageRate * 10) / 10,
      averageReservationDuration: Math.round(averageReservationDuration * 10) / 10,
    };
  }

  async getUsageByDay(query: QueryDashboardDto) {
    const now = new Date();
    const startDate = query.startDate ? startOfDay(new Date(query.startDate)) : startOfDay(now);
    const endDate = query.endDate ? endOfDay(new Date(query.endDate)) : endOfDay(now);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const dailyUsage = await Promise.all(
      days.map(async (day) => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);

        const reservations = await this.prisma.reservation.count({
          where: {
            startDate: { lte: dayEnd },
            endDate: { gte: dayStart },
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
          },
        });

        const totalSpots = await this.prisma.parkingSpot.count();

        return {
          date: day.toISOString().split('T')[0],
          reservations,
          totalSpots,
          occupancyRate: totalSpots > 0 ? Math.round((reservations / totalSpots) * 1000) / 10 : 0,
        };
      }),
    );

    return { dailyUsage };
  }

  async getPopularSpots(query: QueryPopularSpotsDto) {
    const { limit = 10 } = query;

    const spots = await this.prisma.parkingSpot.findMany({
      include: {
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: {
        reservations: { _count: 'desc' },
      },
      take: limit,
    });

    const formattedSpots = spots.map((spot) => ({
      id: spot.id,
      spotNumber: spot.spotNumber,
      row: spot.row,
      hasElectricCharger: spot.hasElectricCharger,
      reservationCount: spot._count.reservations,
    }));

    return { spots: formattedSpots };
  }
}
