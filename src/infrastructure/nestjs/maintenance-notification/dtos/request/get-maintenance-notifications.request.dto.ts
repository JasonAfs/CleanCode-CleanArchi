import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMaintenanceNotificationsRequestDTO {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeRead?: boolean = false;
}
