import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('expire-reservations')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Déclencher manuellement l\'expiration des réservations' })
  @ApiResponse({ status: 200, description: 'Job exécuté' })
  async expireReservations() {
    return this.jobsService.manualExpireReservations();
  }
}
