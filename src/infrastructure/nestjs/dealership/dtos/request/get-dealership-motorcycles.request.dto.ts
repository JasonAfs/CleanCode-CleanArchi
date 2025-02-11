import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';

export class GetDealershipMotorcyclesRequestDTO {
  @ApiPropertyOptional({ enum: MotorcycleStatus })
  @IsOptional()
  @IsEnum(MotorcycleStatus)
  statusFilter?: MotorcycleStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeInactive?: boolean = false;
}
