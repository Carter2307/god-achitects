import { IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'ID de place de parking invalide' })
  parkingSpotId?: string;

  @ApiPropertyOptional({ example: '2024-03-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date de début invalide' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-03-19' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date de fin invalide' })
  endDate?: string;

  @ApiPropertyOptional({ enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus, { message: 'Statut invalide' })
  status?: ReservationStatus;
}
