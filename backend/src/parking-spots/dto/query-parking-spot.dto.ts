import { IsString, IsBoolean, IsOptional, IsDateString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class QueryParkingSpotDto {
  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-F]$/, { message: 'La rangée doit être une lettre de A à F' })
  row?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasElectricCharger?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAvailable?: boolean;
}

export class QueryAvailableSpotsDto {
  @ApiPropertyOptional({ example: '2024-03-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date invalide' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-03-19' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date invalide' })
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasElectricCharger?: boolean;
}
