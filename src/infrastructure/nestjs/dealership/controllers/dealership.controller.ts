import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDealershipUseCase } from '@application/use-cases/dealership/CreateDealershipUseCase';
import { CreateDealershipRequestDTO } from '../dtos/request/create-dealership.request.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { DealershipAlreadyExistsError } from '@domain/errors/dealership/DealershipAlreadyExistsError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { GetDealershipsUseCase } from '@application/use-cases/dealership/GetDealershipsUseCase';

@ApiTags('dealerships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dealerships')
export class DealershipController {
  constructor(
    private readonly createDealershipUseCase: CreateDealershipUseCase,
    private readonly getDealershipsUseCase: GetDealershipsUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Dealership created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Dealership already exists' })
  async createDealership(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateDealershipRequestDTO,
  ) {
    try {
      console.log('Received request:', { ...dto, userRole: req.user.role });
      const result = await this.createDealershipUseCase.execute({
        ...dto,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        console.log('Error result:', result);
        if (result instanceof DealershipAlreadyExistsError) {
          throw new ConflictException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof DealershipValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to create dealership');
      }

      return result;
    } catch (error) {
      console.log('Caught error:', error);
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to create dealership : ${error.message}',
      );
    }
  }

  @Get()
@ApiResponse({ status: 200, description: 'Retrieve all dealerships' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async getDealerships(
    @Request() req: AuthenticatedRequest,
    @Query('includeInactive') includeInactive: boolean = false
) {
    console.log('GetDealerships request:', { 
        userId: req.user.userId,
        userRole: req.user.role,
        includeInactive 
    });

    try {
        const result = await this.getDealershipsUseCase.execute({
            userId: req.user.userId,
            userRole: req.user.role,
            includeInactive
        });

        console.log('GetDealerships result:', result);

        if (result instanceof Error) {
            console.log('GetDealerships error:', result);
            if (result instanceof UnauthorizedError) {
                throw new UnauthorizedException(result.message);
            }
            throw new BadRequestException(result.message);
        }

        return result;
    } catch (error) {
        console.error('GetDealerships caught error:', error);
        if (error instanceof UnauthorizedException) {
            throw error;
        }
        if (error instanceof Error) {
          throw new BadRequestException(`Failed to retrieve dealerships: ${error.message}`);
        }
        throw new BadRequestException('Failed to retrieve dealerships');
    }
}
}
