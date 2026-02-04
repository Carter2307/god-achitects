import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DashboardService } from './dashboard.service';
import { QueryDashboardDto, QueryPopularSpotsDto } from './dto/query-dashboard.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Roles(Role.MANAGER, Role.SECRETARY)
  @ApiOperation({ summary: 'Métriques globales pour le tableau de bord' })
  @ApiResponse({
    status: 200,
    description: 'Métriques récupérées',
    schema: {
      example: {
        totalReservations: 150,
        occupancyRate: 75.5,
        noShowRate: 8.2,
        electricChargerUsageRate: 45.3,
        averageReservationDuration: 2.5,
      },
    },
  })
  async getMetrics(@Query() query: QueryDashboardDto) {
    return this.dashboardService.getMetrics(query);
  }

  @Get('usage-by-day')
  @Roles(Role.MANAGER, Role.SECRETARY)
  @ApiOperation({ summary: 'Utilisation quotidienne du parking' })
  @ApiResponse({ status: 200, description: 'Données d\'utilisation récupérées' })
  async getUsageByDay(@Query() query: QueryDashboardDto) {
    return this.dashboardService.getUsageByDay(query);
  }

  @Get('popular-spots')
  @Roles(Role.MANAGER, Role.SECRETARY)
  @ApiOperation({ summary: 'Places les plus réservées' })
  @ApiResponse({ status: 200, description: 'Places populaires récupérées' })
  async getPopularSpots(@Query() query: QueryPopularSpotsDto) {
    return this.dashboardService.getPopularSpots(query);
  }
}
