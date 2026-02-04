import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { HistoryService } from './history.service';
import { QueryHistoryDto, QueryAllHistoryDto } from './dto/query-history.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

@ApiTags('History')
@Controller('history')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @ApiOperation({ summary: 'Historique des réservations de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Historique récupéré' })
  async findUserHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryHistoryDto,
  ) {
    return this.historyService.findUserHistory(user.id, query);
  }

  @Get('all')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Historique complet de toutes les réservations' })
  @ApiResponse({ status: 200, description: 'Historique récupéré' })
  async findAllHistory(@Query() query: QueryAllHistoryDto) {
    return this.historyService.findAllHistory(query);
  }
}
