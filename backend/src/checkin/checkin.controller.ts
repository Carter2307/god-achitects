import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CheckinService } from './checkin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

@ApiTags('Check-in')
@Controller('checkin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post(':spotNumber')
  @ApiOperation({ summary: 'Check-in via scan du QR code (numéro de place)' })
  @ApiResponse({ status: 200, description: 'Check-in effectué' })
  @ApiResponse({ status: 400, description: 'Aucune réservation active' })
  @ApiResponse({ status: 404, description: 'Place non trouvée' })
  async checkInBySpotNumber(
    @Param('spotNumber') spotNumber: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.checkinService.checkInBySpotNumber(spotNumber, user);
  }

  @Post('reservation/:reservationId')
  @ApiOperation({ summary: 'Check-in via l\'ID de réservation' })
  @ApiResponse({ status: 200, description: 'Check-in effectué' })
  @ApiResponse({ status: 400, description: 'Réservation invalide ou déjà check-in' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  async checkInByReservationId(
    @Param('reservationId') reservationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.checkinService.checkInByReservationId(reservationId, user);
  }
}
