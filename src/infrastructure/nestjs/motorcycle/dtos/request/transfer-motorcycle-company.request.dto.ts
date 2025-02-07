import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TransferMotorcycleCompanyRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetCompanyId!: string;
}