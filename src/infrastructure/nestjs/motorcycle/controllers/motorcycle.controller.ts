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
  NotFoundException,
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
import {
  MotorcycleValidationError,
  MotorcycleNotFoundError,
} from '@domain/errors/motorcycle/MotorcycleValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { AssignMotorcycleToCompanyUseCase } from '@application/use-cases/motorcycle/AssignMotorcycleToCompanyUseCase';
import { ReleaseMotorcycleFromCompanyUseCase } from '@application/use-cases/motorcycle/ReleaseMotorcycleFromCompanyUseCase';
import { TransferMotorcycleBetweenCompaniesUseCase } from '@application/use-cases/motorcycle/TransferMotorcycleBetweenCompaniesUseCase';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { AssignMotorcycleCompanyRequestDTO } from '../dtos/request/assign-motorcycle-company.request.dto';
import { TransferMotorcycleCompanyRequestDTO } from '../dtos/request/transfer-motorcycle-company.request.dto';

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
    private readonly assignMotorcycleToCompanyUseCase: AssignMotorcycleToCompanyUseCase,
    private readonly releaseMotorcycleFromCompanyUseCase: ReleaseMotorcycleFromCompanyUseCase,
    private readonly transferMotorcycleBetweenCompaniesUseCase: TransferMotorcycleBetweenCompaniesUseCase,
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
      console.log(result);

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
  @ApiResponse({
    status: 404,
    description: 'Motorcycle or dealership not found',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Motorcycle mileage updated successfully',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Motorcycle transferred successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Motorcycle or dealership not found',
  })
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
        if (
          result instanceof DealershipNotFoundError ||
          result instanceof MotorcycleNotFoundError
        ) {
          throw new NotFoundException(result.message);
        }
        if (
          result instanceof MotorcycleValidationError ||
          result instanceof DealershipValidationError
        ) {
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

  @Patch(':id/assign-company')
  @ApiResponse({
    status: 200,
    description: 'Motorcycle assigned to company successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Motorcycle or company not found' })
  async assignMotorcycleToCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') motorcycleId: string,
    @Body() dto: AssignMotorcycleCompanyRequestDTO,
  ) {
    try {
      const result = await this.assignMotorcycleToCompanyUseCase.execute({
        motorcycleId,
        companyId: dto.companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.userDealershipId,
      });
      console.log(result)
      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof MotorcycleNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        if (result instanceof MotorcycleValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to assign motorcycle to company');
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
        `Failed to assign motorcycle to company: ${error.message}`,
      );
    }
  }

  @Patch(':id/release-company')
  @ApiResponse({
    status: 200,
    description: 'Motorcycle released from company successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Motorcycle not found' })
  async releaseMotorcycleFromCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') motorcycleId: string,
  ) {
    try {
      const result = await this.releaseMotorcycleFromCompanyUseCase.execute({
        motorcycleId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.userDealershipId,
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
        throw new BadRequestException(
          'Failed to release motorcycle from company',
        );
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
        `Failed to release motorcycle from company: ${error.message}`,
      );
    }
  }

  @Patch(':id/transfer-company')
  @ApiResponse({
    status: 200,
    description: 'Motorcycle transferred between companies successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Motorcycle or company not found' })
  async transferMotorcycleBetweenCompanies(
    @Request() req: AuthenticatedRequest,
    @Param('id') motorcycleId: string,
    @Body() dto: TransferMotorcycleCompanyRequestDTO,
  ) {
    try {
      const result =
        await this.transferMotorcycleBetweenCompaniesUseCase.execute({
          motorcycleId,
          targetCompanyId: dto.targetCompanyId,
          userId: req.user.userId,
          userRole: req.user.role,
          dealershipId: req.user.userDealershipId,
        });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof MotorcycleNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        if (result instanceof MotorcycleValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException(
          'Failed to transfer motorcycle between companies',
        );
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
        `Failed to transfer motorcycle between companies: ${error.message}`,
      );
    }
  }
}
