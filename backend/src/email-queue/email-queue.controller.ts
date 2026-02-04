import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EmailQueueService } from './email-queue.service';
import { QueryEmailQueueDto } from './dto/query-email-queue.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Email Queue')
@Controller('email-queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmailQueueController {
  constructor(private readonly emailQueueService: EmailQueueService) {}

  @Get()
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Liste des messages en attente' })
  @ApiResponse({ status: 200, description: 'Liste des messages' })
  async findAll(@Query() query: QueryEmailQueueDto) {
    return this.emailQueueService.findAll(query);
  }

  @Post('retry/:id')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Réessayer l\'envoi d\'un email échoué' })
  @ApiResponse({ status: 200, description: 'Email ajouté à la file d\'attente' })
  @ApiResponse({ status: 404, description: 'Email non trouvé ou non échoué' })
  async retry(@Param('id') id: string) {
    return this.emailQueueService.retry(id);
  }
}
