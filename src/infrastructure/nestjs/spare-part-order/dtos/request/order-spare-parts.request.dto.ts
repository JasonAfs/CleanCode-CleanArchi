import {
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDTO {
  @IsString()
  @ApiProperty()
  sparePartReference!: string;

  @IsNumber()
  @ApiProperty()
  quantity!: number;
}

export class OrderSparePartsRequestDTO {
  @ApiProperty({ type: [OrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items!: OrderItemDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  estimatedDeliveryDate?: Date;
}
