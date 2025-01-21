import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanyDTO } from '@application/dtos/company/CreateCompanyDTO';
import { UserRole } from '@domain/enums/UserRole';

export class CreateCompanyRequestDTO implements CreateCompanyDTO {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ enum: UserRole })
  userRole!: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dealershipId?: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  registrationNumber!: string;

  @ApiProperty()
  @IsString()
  street!: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  postalCode!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiProperty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;
}