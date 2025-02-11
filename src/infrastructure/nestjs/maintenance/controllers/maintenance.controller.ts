import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetMaintenancesUseCase } from '@application/use-cases/maintenance/GetMaintenancesUseCase';
import { GetMaintenancesRequestDTO } from '../dtos/request/get-maintenances.request.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { GetMaintenanceDetailsUseCase } from '@application/use-cases/maintenance/GetMaintenanceDetailsUseCase';

@ApiTags('maintenances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenances')
export class MaintenanceController {
  constructor(
    private readonly getMaintenancesUseCase: GetMaintenancesUseCase,
    private readonly getMaintenanceDetailsUseCase: GetMaintenanceDetailsUseCase,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved maintenances successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMaintenances(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetMaintenancesRequestDTO,
  ) {
    const result = await this.getMaintenancesUseCase.execute({
      userId: req.user.userId,
      userRole: req.user.role,
      dealershipId: req.user.userDealershipId,
      companyId: req.user.userCompanyId,
      ...query,
    });


    if (result instanceof Error) {
      throw new BadRequestException(result.message);
    }

    return result;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Maintenance details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Maintenance not found' })
  @ApiParam({ name: 'id', type: String })
  async getMaintenanceDetails(
    @Request() req: AuthenticatedRequest,
    @Param('id') maintenanceId: string,
  ) {
    return this.getMaintenanceDetailsUseCase.execute({
      maintenanceId,
      userId: req.user.userId,
      userRole: req.user.role,
      userDealershipId: req.user.userDealershipId,
      userCompanyId: req.user.userCompanyId,
    });
  }
}
