import { IsString, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParkingSpotDto {
  @ApiProperty({ example: 'A01', description: 'Numéro de la place (ex: A01, B05)' })
  @IsString()
  @Matches(/^[A-F]\d{2}$/, { message: 'Le numéro de place doit être au format lettre + 2 chiffres (ex: A01)' })
  spotNumber: string;

  @ApiProperty({ example: 'A', description: 'Rangée (A-F)' })
  @IsString()
  @Matches(/^[A-F]$/, { message: 'La rangée doit être une lettre de A à F' })
  row: string;

  @ApiPropertyOptional({ default: false, description: 'Présence d\'une prise électrique' })
  @IsOptional()
  @IsBoolean()
  hasElectricCharger?: boolean;
}
