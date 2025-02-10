import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetMaintenanceNotificationsUseCase } from '@application/use-cases/maintenance/GetMaintenanceNotificationsUseCase';
import { GetMaintenanceNotificationsRequestDTO } from '../dtos/request/get-maintenance-notifications.request.dto';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';

@ApiTags('maintenance-notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance-notifications')
export class MaintenanceNotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetMaintenanceNotificationsUseCase,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved notifications successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNotifications(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetMaintenanceNotificationsRequestDTO,
  ) {
    try {
      const result = await this.getNotificationsUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        dealershipId: req.user.userDealershipId,
        companyId: req.user.userCompanyId,
        includeRead: query.includeRead,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException('Failed to retrieve notifications');
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const err = error as Error;
      throw new BadRequestException(
        `Failed to retrieve notifications: ${err.message}`,
      );
    }
  }
}
