import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { QueryReservationDto, QueryAllReservationsDto } from './dto/query-reservation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @ApiOperation({ summary: 'Liste des réservations de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async findUserReservations(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryReservationDto,
  ) {
    return this.reservationsService.findUserReservations(user.id, query);
  }

  @Get('all')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Liste de toutes les réservations' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async findAllReservations(@Query() query: QueryAllReservationsDto) {
    return this.reservationsService.findAllReservations(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation trouvée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reservationsService.findOne(id, user);
  }

  @Post()
  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  @ApiResponse({ status: 400, description: 'Données invalides ou place non disponible' })
  async create(@Body() dto: CreateReservationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reservationsService.create(dto, user);
  }

  @Put(':id')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Modifier une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation modifiée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  async update(@Param('id') id: string, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  async cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reservationsService.cancel(id, user);
  }
}
