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
import { ParkingSpotsService } from './parking-spots.service';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto';
import { QueryParkingSpotDto, QueryAvailableSpotsDto } from './dto/query-parking-spot.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Parking Spots')
@Controller('parking-spots')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste de toutes les places de parking' })
  @ApiResponse({ status: 200, description: 'Liste des places' })
  async findAll(@Query() query: QueryParkingSpotDto) {
    return this.parkingSpotsService.findAll(query);
  }

  @Get('available')
  @ApiOperation({ summary: 'Places disponibles pour une période donnée' })
  @ApiResponse({ status: 200, description: 'Liste des places disponibles' })
  async findAvailable(@Query() query: QueryAvailableSpotsDto) {
    return this.parkingSpotsService.findAvailable(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une place de parking' })
  @ApiResponse({ status: 200, description: 'Place trouvée' })
  @ApiResponse({ status: 404, description: 'Place non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.parkingSpotsService.findOne(id);
  }

  @Post()
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Créer une nouvelle place de parking' })
  @ApiResponse({ status: 201, description: 'Place créée' })
  @ApiResponse({ status: 409, description: 'Numéro de place déjà utilisé' })
  async create(@Body() dto: CreateParkingSpotDto) {
    return this.parkingSpotsService.create(dto);
  }

  @Put(':id')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Modifier une place de parking' })
  @ApiResponse({ status: 200, description: 'Place modifiée' })
  @ApiResponse({ status: 404, description: 'Place non trouvée' })
  async update(@Param('id') id: string, @Body() dto: UpdateParkingSpotDto) {
    return this.parkingSpotsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SECRETARY)
  @ApiOperation({ summary: 'Supprimer une place de parking' })
  @ApiResponse({ status: 200, description: 'Place supprimée' })
  @ApiResponse({ status: 404, description: 'Place non trouvée' })
  async remove(@Param('id') id: string) {
    return this.parkingSpotsService.remove(id);
  }
}
