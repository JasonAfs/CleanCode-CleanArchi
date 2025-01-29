import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// Use Cases
import { CreateDealershipUseCase } from '@application/use-cases/dealership/CreateDealershipUseCase';
import { GetDealershipsUseCase } from '@application/use-cases/dealership/GetDealershipsUseCase';
import { GetDealershipByIdUseCase } from '@application/use-cases/dealership/GetDealershipByIdUseCase';
import { UpdateDealershipInfoUseCase } from '@application/use-cases/dealership/UpdateDealershipInfoUseCase';
import { DeactivateDealershipUseCase } from '@application/use-cases/dealership/DeactivateDealershipUseCase';
import { AddDealershipEmployeeUseCase } from '@application/use-cases/dealershipEmployee/AddDealershipEmployeeUseCase';
import { RemoveDealershipEmployeeUseCase } from '@application/use-cases/dealershipEmployee/RemoveDealershipEmployeeUseCase';

// DTOs
import { CreateDealershipRequestDTO } from '../dtos/request/create-dealership.request.dto';
import { UpdateDealershipInfoRequestDTO } from '../dtos/request/update-dealership-info.request.dto';
import { AddDealershipEmployeeRequestDTO } from '../dtos/request/add-dealership-employee.request.dto';
import { GetDealershipsQueryDTO } from '../dtos/request/get-dealerships.request.dto';

// Domain Errors
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipAlreadyExistsError } from '@domain/errors/dealership/DealershipAlreadyExistsError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';

// Types
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

@ApiTags('dealerships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dealerships')
export class DealershipController {
  constructor(
    private readonly createDealershipUseCase: CreateDealershipUseCase,
    private readonly getDealershipsUseCase: GetDealershipsUseCase,
    private readonly getDealershipByIdUseCase: GetDealershipByIdUseCase,
    private readonly updateDealershipInfoUseCase: UpdateDealershipInfoUseCase,
    private readonly deactivateDealershipUseCase: DeactivateDealershipUseCase,
    private readonly addDealershipEmployeeUseCase: AddDealershipEmployeeUseCase,
    private readonly removeDealershipEmployeeUseCase: RemoveDealershipEmployeeUseCase,
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
      const result = await this.createDealershipUseCase.execute({
        ...dto,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
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
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create dealership: ${error.message}`,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieved all dealerships' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async getDealerships(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetDealershipsQueryDTO,
  ) {
    try {
      const result = await this.getDealershipsUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        includeInactive: query.includeInactive,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve dealerships: ${error.message}`,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieved dealership details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Dealership not found' })
  @ApiParam({ name: 'id', type: String })
  async getDealershipById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    try {
      const result = await this.getDealershipByIdUseCase.execute({
        dealershipId: id,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (result instanceof DealershipNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve dealership: ${error.message}`,
      );
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Dealership updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Dealership not found' })
  @ApiParam({ name: 'id', type: String })
  async updateDealership(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateDealershipInfoRequestDTO,
  ) {
    try {
      const result = await this.updateDealershipInfoUseCase.execute({
        ...dto,
        dealershipId: id,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (result instanceof DealershipNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof DealershipValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to update dealership');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update dealership: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Dealership deactivated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Dealership not found' })
  @ApiParam({ name: 'id', type: String })
  async deactivateDealership(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    try {
      const result = await this.deactivateDealershipUseCase.execute({
        dealershipId: id,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (result instanceof DealershipNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to deactivate dealership: ${error.message}`,
      );
    }
  }

  @Post(':id/employees')
  @ApiResponse({ status: 201, description: 'Employee added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Dealership or employee not found' })
  @ApiParam({ name: 'id', type: String })
  async addEmployee(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddDealershipEmployeeRequestDTO,
  ) {
    try {
      const result = await this.addDealershipEmployeeUseCase.execute({
        dealershipId: id,
        employeeId: dto.employeeId,
        role: dto.role,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (
          result instanceof DealershipNotFoundError ||
          result instanceof UserNotFoundError
        ) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof DealershipValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to add employee');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to add employee: ${error.message}`);
    }
  }

  @Delete(':id/employees/:employeeId')
  @ApiResponse({ status: 200, description: 'Employee removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Dealership or employee not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'employeeId', type: String })
  async removeEmployee(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
  ) {
    try {
      const result = await this.removeDealershipEmployeeUseCase.execute({
        dealershipId: id,
        employeeId: employeeId,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (
          result instanceof DealershipNotFoundError ||
          result instanceof UserNotFoundError
        ) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof DealershipValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to remove employee');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to remove employee: ${error.message}`,
      );
    }
  }
}
