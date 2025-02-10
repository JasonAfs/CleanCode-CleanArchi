import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export class CreateSparePartRequestDTO {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  reference!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({ enum: SparePartCategory })
  @IsEnum(SparePartCategory)
  category!: SparePartCategory;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty()
  @IsString()
  manufacturer!: string;

  @ApiProperty({ type: [String], enum: MotorcycleModel })
  @IsArray()
  @IsEnum(MotorcycleModel, { each: true })
  compatibleModels!: MotorcycleModel[];

  @ApiProperty()
  @IsNumber()
  minimumThreshold!: number;

  @ApiProperty()
  @IsNumber()
  unitPrice!: number;
}
