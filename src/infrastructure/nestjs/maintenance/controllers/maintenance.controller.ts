import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetMaintenancesUseCase } from '@application/use-cases/maintenance/GetMaintenancesUseCase';
import { GetMaintenancesRequestDTO } from '../dtos/request/get-maintenances.request.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

@ApiTags('maintenances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenances')
export class MaintenanceController {
  constructor(
    private readonly getMaintenancesUseCase: GetMaintenancesUseCase,
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
    console.log(result);

    if (result instanceof Error) {
      throw new BadRequestException(result.message);
    }

    return result;
  }
}
