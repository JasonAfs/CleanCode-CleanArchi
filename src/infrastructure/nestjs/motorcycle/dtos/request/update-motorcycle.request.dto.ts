import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export class UpdateMotorcycleRequestDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dealershipId?: string;

  @ApiProperty({ required: false })
  @IsEnum(MotorcycleModel)
  @IsOptional()
  modelType?: MotorcycleModel;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  mileage?: number;
}
