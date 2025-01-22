import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, ConflictException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginRequestDTO } from '../dtos/request/login.request.dto';
import { RegisterRequestDTO } from '../dtos/request/register.request.dto';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { InvalidCredentialsError } from '@domain/errors/auth/InvalidCredentialsError';
import { UserAlreadyExistsError } from '@domain/errors/user/UserAlreadyExistsError';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginRequestDTO) {
    const result = await this.loginUseCase.execute(dto);
    
    if (result instanceof Error) {
      if (result instanceof InvalidCredentialsError) {
        throw new BadRequestException(result.message);
      }
      throw new BadRequestException('Login failed');
    }

    return result;
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterRequestDTO) {
    const result = await this.registerUseCase.execute(dto);

    if (result instanceof Error) {
      if (result instanceof UserAlreadyExistsError) {
        throw new ConflictException(result.message);
      }
      throw new BadRequestException(result.message);
    }

    return result;
  }
}