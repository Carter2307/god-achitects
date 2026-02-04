import { IsString, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParkingSpotDto {
  @ApiPropertyOptional({ example: 'A01' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-F]\d{2}$/, { message: 'Le numéro de place doit être au format lettre + 2 chiffres' })
  spotNumber?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-F]$/, { message: 'La rangée doit être une lettre de A à F' })
  row?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasElectricCharger?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
