import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class FindReservationsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  parkingSpotId?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  statut?: ReservationStatus;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
