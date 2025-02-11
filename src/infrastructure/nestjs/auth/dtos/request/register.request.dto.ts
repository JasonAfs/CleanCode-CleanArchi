import { IsEmail, IsString, MinLength } from 'class-validator';
import { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
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
}
