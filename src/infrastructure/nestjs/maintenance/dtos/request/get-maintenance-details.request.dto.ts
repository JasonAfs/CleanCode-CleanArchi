import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMaintenanceDetailsRequestDTO {
  @ApiProperty()
  @IsString()
  maintenanceId!: string;
}
