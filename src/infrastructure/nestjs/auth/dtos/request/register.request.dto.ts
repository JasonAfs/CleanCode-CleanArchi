import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import { UserRole } from '@domain/enums/UserRole';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDTO implements RegisterDTO {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ required: false })
  companyId?: string;

  @ApiProperty({ required: false })
  dealershipId?: string;
}