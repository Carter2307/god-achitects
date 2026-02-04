import { IsString, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-of-parking-spot' })
  @IsUUID('4', { message: 'ID de place de parking invalide' })
  parkingSpotId: string;

  @ApiProperty({ example: '2024-03-15' })
  @IsDateString({}, { message: 'Format de date de début invalide' })
  startDate: string;

  @ApiProperty({ example: '2024-03-19' })
  @IsDateString({}, { message: 'Format de date de fin invalide' })
  endDate: string;
}
