import { Controller, Post, Put, Delete, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCompanyUseCase } from '@application/use-cases/company/CreateCompanyUseCase';
import { UpdateCompanyInfoUseCase } from '@application/use-cases/company/UpdateCompanyInfoUseCase';
import { DeactivateCompanyUseCase } from '@application/use-cases/company/DeactivateCompanyUseCase';
import { GetCompanyAssignedMotorcyclesUseCase } from '@application/use-cases/company/GetCompanyAssignedMotorcyclesUseCase';
import { GetCompanyEmployeeHistoryUseCase } from '@application/use-cases/company/GetCompanyEmployeeHistoryUseCase';
import { CreateCompanyRequestDTO } from '../dtos/request/create-company.request.dto';
import { UpdateCompanyInfoRequestDTO } from '../dtos/request/update-company-info.request.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

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
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  async createCompany(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCompanyRequestDTO
  ) {
    return this.createCompanyUseCase.execute({
      ...dto,
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.dealershipId
    });
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  async updateCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
    @Body() dto: UpdateCompanyInfoRequestDTO,
  ) {
    return this.updateCompanyUseCase.execute({
      ...dto,
      companyId,
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.dealershipId
    });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Company deactivated successfully' })
  async deactivateCompany(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    return this.deactivateCompanyUseCase.execute({
      companyId,
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.dealershipId
    });
  }

  @Get(':id/motorcycles')
  @ApiResponse({ status: 200, description: 'Company motorcycles retrieved successfully' })
  async getCompanyMotorcycles(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    return this.getAssignedMotorcyclesUseCase.execute({
      companyId,
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.dealershipId,
      includeInactive: false
    });
  }

  @Get(':id/employees')
  @ApiResponse({ status: 200, description: 'Company employees retrieved successfully' })
  async getCompanyEmployees(
    @Request() req: AuthenticatedRequest,
    @Param('id') companyId: string,
  ) {
    return this.getEmployeeHistoryUseCase.execute({
      companyId,
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.dealershipId,
      includeInactive: false
    });
  }
}