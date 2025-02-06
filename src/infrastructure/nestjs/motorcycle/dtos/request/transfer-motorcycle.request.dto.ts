import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TransferMotorcycleRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dealershipId!: string;
}
