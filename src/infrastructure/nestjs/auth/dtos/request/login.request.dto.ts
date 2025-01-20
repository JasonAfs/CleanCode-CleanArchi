import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginDTO } from '@application/dtos/auth/LoginDTO';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO implements LoginDTO {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;
}