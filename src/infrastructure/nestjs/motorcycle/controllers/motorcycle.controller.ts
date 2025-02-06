// src/infrastructure/nestjs/motorcycle/controllers/motorcycle.controller.ts
import { 
    Controller, 
    Post, 
    Patch,
    Body, 
    UseGuards, 
    Request,
    Param,
    BadRequestException,
    UnauthorizedException,
    NotFoundException
  } from '@nestjs/common';
  import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { CreateMotorcycleUseCase } from '@application/use-cases/motorcycle/CreateMotorcycleUseCase';
import { UpdateMotorcycleUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleUseCase';
import { UpdateMotorcycleMileageUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleMileageUseCase';
import { TransferMotorcycleToDealershipUseCase } from '@application/use-cases/motorcycle/TransferMotorcycleToDealershipUseCase';
  import { CreateMotorcycleRequestDTO } from '../../motorcycle/dtos/request/create-motorcycle.request.dto';
  import { UpdateMotorcycleRequestDTO } from '../../motorcycle/dtos/request/update-motorcycle.request.dto';
  import { TransferMotorcycleRequestDTO } from '../../motorcycle/dtos/request/transfer-motorcycle.request.dto';
  import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleValidationError, MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
  
  @ApiTags('motorcycles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('motorcycles')
  export class MotorcycleController {
    constructor(
      private readonly createMotorcycleUseCase: CreateMotorcycleUseCase,
      private readonly updateMotorcycleUseCase: UpdateMotorcycleUseCase,
      private readonly updateMotorcycleMileageUseCase: UpdateMotorcycleMileageUseCase,
      private readonly transferMotorcycleUseCase: TransferMotorcycleToDealershipUseCase,
    ) {}
  
    @Post()
    @ApiResponse({ status: 201, description: 'Motorcycle created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Dealership not found' })
    async createMotorcycle(
      @Request() req: AuthenticatedRequest,
      @Body() dto: CreateMotorcycleRequestDTO,
    ) {
      try {
        const result = await this.createMotorcycleUseCase.execute({
          ...dto,
          userId: req.user.userId,
          userRole: req.user.role,
          dealershipId: dto.dealershipId,
        });
        console.log(result)
  
        if (result instanceof Error) {
          if (result instanceof UnauthorizedError) {
            throw new UnauthorizedException(result.message);
          }
          if (result instanceof DealershipNotFoundError) {
            throw new NotFoundException(result.message);
          }
          if (result instanceof MotorcycleValidationError) {
            throw new BadRequestException(result.message);
          }
          throw new BadRequestException('Failed to create motorcycle');
        }
  
        return result;
      } catch (err) {
        const error = err as Error;
        if (
          error instanceof UnauthorizedException ||
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new BadRequestException(
          `Failed to create motorcycle: ${error.message}`,
        );
      }
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Motorcycle updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Motorcycle or dealership not found' })
    async updateMotorcycle(
      @Request() req: AuthenticatedRequest,
      @Param('id') motorcycleId: string,
      @Body() dto: UpdateMotorcycleRequestDTO,
    ) {
      try {
        const result = await this.updateMotorcycleUseCase.execute({
          ...dto,
          motorcycleId,
          userId: req.user.userId,
          userRole: req.user.role,
        });

        if (result instanceof Error) {
          if (result instanceof UnauthorizedError) {
            throw new UnauthorizedException(result.message);
          }
          if (result instanceof DealershipNotFoundError) {
            throw new NotFoundException(result.message);
          }
          if (result instanceof MotorcycleValidationError) {
            throw new BadRequestException(result.message);
          }
          throw new BadRequestException('Failed to update motorcycle');
        }

        return result;
      } catch (err) {
        const error = err as Error;
        if (
          error instanceof UnauthorizedException ||
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new BadRequestException(
          `Failed to update motorcycle: ${error.message}`,
        );
      }
    }

    @Patch(':id/mileage')
    @ApiResponse({ status: 200, description: 'Motorcycle mileage updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Motorcycle not found' })
    async updateMotorcycleMileage(
      @Request() req: AuthenticatedRequest,
      @Param('id') motorcycleId: string,
      @Body() dto: { mileage: number },
    ) {
      try {
        const result = await this.updateMotorcycleMileageUseCase.execute({
          motorcycleId,
          mileage: dto.mileage,
          userId: req.user.userId,
          userRole: req.user.role,
          userDealershipId: req.user.userDealershipId,
        });

        if (result instanceof Error) {
          if (result instanceof UnauthorizedError) {
            throw new UnauthorizedException(result.message);
          }
          if (result instanceof MotorcycleNotFoundError) {
            throw new NotFoundException(result.message);
          }
          if (result instanceof MotorcycleValidationError) {
            throw new BadRequestException(result.message);
          }
          throw new BadRequestException('Failed to update motorcycle mileage');
        }

        return result;
      } catch (err) {
        const error = err as Error;
        if (
          error instanceof UnauthorizedException ||
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new BadRequestException(
          `Failed to update motorcycle mileage: ${error.message}`,
        );
      }
    }

    @Patch(':id/transfer')
    @ApiResponse({ status: 200, description: 'Motorcycle transferred successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Motorcycle or dealership not found' })
    async transferMotorcycle(
      @Request() req: AuthenticatedRequest,
      @Param('id') motorcycleId: string,
      @Body() dto: TransferMotorcycleRequestDTO,
    ) {
      try {
        const result = await this.transferMotorcycleUseCase.execute({
          motorcycleId,
          targetDealershipId: dto.dealershipId,
          userId: req.user.userId,
          userRole: req.user.role,
        });

        if (result instanceof Error) {
          if (result instanceof UnauthorizedError) {
            throw new UnauthorizedException(result.message);
          }
          if (result instanceof DealershipNotFoundError || result instanceof MotorcycleNotFoundError) {
            throw new NotFoundException(result.message);
          }
          if (result instanceof MotorcycleValidationError || result instanceof DealershipValidationError) {
            throw new BadRequestException(result.message);
          }
          throw new BadRequestException('Failed to transfer motorcycle');
        }

        return result;
      } catch (err) {
        const error = err as Error;
        if (
          error instanceof UnauthorizedException ||
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new BadRequestException(
          `Failed to transfer motorcycle: ${error.message}`,
        );
      }
    }
  }
