import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AssignMotorcycleCompanyRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyId!: string;
}