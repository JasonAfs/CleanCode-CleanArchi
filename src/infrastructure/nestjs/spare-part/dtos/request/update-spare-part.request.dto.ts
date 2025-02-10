import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export class UpdateSparePartRequestDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({ enum: SparePartCategory })
  @IsOptional()
  @IsEnum(SparePartCategory)
  category?: SparePartCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ type: [String], enum: MotorcycleModel })
  @IsOptional()
  @IsArray()
  @IsEnum(MotorcycleModel, { each: true })
  compatibleModels?: MotorcycleModel[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minimumThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}
