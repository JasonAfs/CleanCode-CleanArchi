import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export class GetSparePartsRequestDTO {
  @ApiPropertyOptional({ enum: SparePartCategory })
  @IsOptional()
  @IsEnum(SparePartCategory)
  category?: SparePartCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ enum: MotorcycleModel })
  @IsOptional()
  @IsEnum(MotorcycleModel)
  compatibleModel?: MotorcycleModel;
}
