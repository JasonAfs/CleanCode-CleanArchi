import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam,ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// Use Cases
import { CreateCompanyUseCase } from '@application/use-cases/company/CreateCompanyUseCase';
import { UpdateCompanyInfoUseCase } from '@application/use-cases/company/UpdateCompanyInfoUseCase';
import { DeactivateCompanyUseCase } from '@application/use-cases/company/DeactivateCompanyUseCase';
import { GetCompanyAssignedMotorcyclesUseCase } from '@application/use-cases/company/GetCompanyAssignedMotorcyclesUseCase';
import { GetCompanyEmployeeHistoryUseCase } from '@application/use-cases/company/GetCompanyEmployeeHistoryUseCase';
import { AddCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/AddCompanyEmployeeUseCase';
import { RemoveCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/RemoveCompanyEmployeeUseCase';

// DTOs
import { CreateCompanyRequestDTO } from '../dtos/request/create-company.request.dto';
import { UpdateCompanyInfoRequestDTO } from '../dtos/request/update-company-info.request.dto';
import { AddCompanyEmployeeRequestDTO } from '../dtos/request/add-company-employee.request.dto';

// Domain Errors
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';

// Types
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { UserRole } from '@domain/enums/UserRole';

import { GetCompaniesUseCase } from '@application/use-cases/company/GetCompaniesUseCase';
import { GetCompaniesRequestDTO } from '../dtos/request/get-companies.request.dto';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyInfoUseCase,
    private readonly deactivateCompanyUseCase: DeactivateCompanyUseCase,
    private readonly getAssignedMotorcyclesUseCase: GetCompanyAssignedMotorcyclesUseCase,
    private readonly getEmployeeHistoryUseCase: GetCompanyEmployeeHistoryUseCase,
    private readonly addEmployeeUseCase: AddCompanyEmployeeUseCase,
    private readonly removeEmployeeUseCase: RemoveCompanyEmployeeUseCase,
    private readonly getCompaniesUseCase: GetCompaniesUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Company already exists' })
  async createCompany(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCompanyRequestDTO,
  ) {
    try {
      const result = await this.createCompanyUseCase.execute({
        ...dto,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
      });
      
      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to create company');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create company: ${error.message}`,
      );
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', type: String })
  async updateCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
    @Body() dto: UpdateCompanyInfoRequestDTO,
  ) {
    try {
      console.log("cacacacac"+req.user.companyId)
      if (req.user.role === UserRole.COMPANY_MANAGER && req.user.companyId !== companyId) {
        throw new UnauthorizedException('You can only update your own company');
      }

      const result = await this.updateCompanyUseCase.execute({
        ...dto,
        companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to update company');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update company: ${error.message}`,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieved all companies' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async getCompanies(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetCompaniesRequestDTO
  ) {
    try {
      const result = await this.getCompaniesUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        userDealershipId: req.user.dealershipId,
        includeInactive: query.includeInactive
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to retrieve companies');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve companies: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Company deactivated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', type: String })
  async deactivateCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    try {
      const result = await this.deactivateCompanyUseCase.execute({
        companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to deactivate company');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to deactivate company: ${error.message}`,
      );
    }
  }

  @Get(':id/motorcycles')
  @ApiResponse({
    status: 200,
    description: 'Company motorcycles retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', type: String })
  async getCompanyMotorcycles(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    try {

      if (req.user.role === UserRole.COMPANY_MANAGER && req.user.companyId !== companyId) {
        throw new UnauthorizedException('You can only view your own company motorcycles');
      }

      const result = await this.getAssignedMotorcyclesUseCase.execute({
        companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
        includeInactive: false,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to retrieve company motorcycles');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve company motorcycles: ${error.message}`,
      );
    }
  }

  @Get(':id/employees')
  @ApiResponse({
    status: 200,
    description: 'Company employees retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiParam({ name: 'id', type: String })
  async getCompanyEmployees(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    if (req.user.role === UserRole.COMPANY_MANAGER && req.user.companyId !== companyId) {
      throw new UnauthorizedException('You can only view your own company employees');
    }
    try {
      const result = await this.getEmployeeHistoryUseCase.execute({
        companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
        includeInactive: false,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to retrieve company employees');
      }

      return result;
    } catch (err) {
      const error = err as Error;
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve company employees: ${error.message}`,
      );
    }
  }

  @Post(':id/employees')
  @ApiResponse({ status: 201, description: 'Employee added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company or employee not found' })
  @ApiParam({ name: 'id', type: String })
  async addEmployee(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
    @Body() dto: AddCompanyEmployeeRequestDTO,
  ) {
    if (req.user.role === UserRole.COMPANY_MANAGER && req.user.companyId !== companyId) {
      throw new UnauthorizedException('You can only add employees to your own company');
    }

    try {
      const result = await this.addEmployeeUseCase.execute({
        ...dto,
        companyId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof UserNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to add employee to company');
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
        `Failed to add employee to company: ${error.message}`,
      );
    }
  }

  @Delete(':id/employees/:employeeId')
  @ApiResponse({ status: 200, description: 'Employee removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company or employee not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'employeeId', type: String })
  async removeEmployee(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    if (req.user.role === UserRole.COMPANY_MANAGER && req.user.companyId !== companyId) {
      throw new UnauthorizedException('You can only remove employees from your own company');
    }

    try {
      const result = await this.removeEmployeeUseCase.execute({
        companyId,
        employeeId,
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.dealershipId,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        if (result instanceof UserNotFoundError) {
          throw new NotFoundException(result.message);
        }
        if (result instanceof CompanyValidationError) {
          throw new BadRequestException(result.message);
        }
        throw new BadRequestException('Failed to remove employee from company');
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
        `Failed to remove employee from company: ${error.message}`,
      );
    }
  }
}
