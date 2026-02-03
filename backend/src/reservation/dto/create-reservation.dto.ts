import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  userId: string;

  @IsDateString()
  date: string;

  @IsUUID()
  @IsOptional()
  parkingSpotId?: string;

  @IsBoolean()
  besoinChargeur: boolean;
}
