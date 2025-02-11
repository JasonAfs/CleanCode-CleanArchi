import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { JwtPayload } from 'jsonwebtoken';

import { OrderSparePartsUseCase } from '@application/use-cases/spare-part/OrderSparePartsUseCase';
import { GetDealershipStockUseCase } from '@application/use-cases/spare-part/GetDealershipStockUseCase';
import { GetSparePartOrderHistoryUseCase } from '@application/use-cases/spare-part/GetSparePartOrderHistoryUseCase';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import {
  ValidateSparePartOrderDTO,
  ValidateSparePartOrderResponseDTO,
} from '@application/dtos/spare-part/ValidateSparePartOrderDTO';
import { ValidateSparePartOrderUseCase } from '@application/use-cases/spare-part/ValidateSparePartOrderUseCase';

import { OrderSparePartsRequestDTO } from '../dtos/request/order-spare-parts.request.dto';
import { UserRole } from '@domain/enums/UserRole';

@ApiTags('spare-part-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dealerships/spare-parts')
export class SparePartOrderController {
  constructor(
    private readonly orderSparePartsUseCase: OrderSparePartsUseCase,
    private readonly getDealershipStockUseCase: GetDealershipStockUseCase,
    private readonly getOrderHistoryUseCase: GetSparePartOrderHistoryUseCase,
    private readonly validateSparePartOrderUseCase: ValidateSparePartOrderUseCase,
  ) {}

  @Get('stock')
  @ApiResponse({ status: 200, description: 'Retrieved stock successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDealershipStock(@Request() req: AuthenticatedRequest) {
    if (!req.user.userDealershipId) {
      throw new UnauthorizedException(
        'User is not associated with a dealersssssssship',
      );
    }

    try {
      const result = await this.getDealershipStockUseCase.execute({
        dealershipId: req.user.userDealershipId,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Post('orders')
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async orderSpareParts(
    @Request() req: AuthenticatedRequest,
    @Body() dto: OrderSparePartsRequestDTO,
  ) {
    if (!req.user.userDealershipId) {
      throw new UnauthorizedException(
        'User is not associated with a dealership',
      );
    }

    

    const orderData = {
      ...dto,
      dealershipId: req.user.userDealershipId,
      userId: req.user.userId,
      userRole: req.user.role,
    };



    try {
      const result = await this.orderSparePartsUseCase.execute(orderData);

      if (result instanceof Error) {
        if (result instanceof UnauthorizedError) {
          throw new UnauthorizedException(result.message);
        }
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Get('orders')
  @ApiResponse({
    status: 200,
    description: 'Retrieved order history successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrderHistory(@Request() req: AuthenticatedRequest) {
    try {
      // Pour les admins, on peut passer undefined comme dealershipId
      const dealershipId =
        req.user.role === UserRole.TRIUMPH_ADMIN
          ? undefined
          : req.user.userDealershipId;

      if (!dealershipId && req.user.role !== UserRole.TRIUMPH_ADMIN) {
        throw new UnauthorizedError('User is not associated with a dealership');
      }

      return this.getOrderHistoryUseCase.execute({
        dealershipId,
        userId: req.user.userId,
        userRole: req.user.role,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Post('validate')
  @ApiResponse({ status: 200, description: 'Order validated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateOrder(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ValidateSparePartOrderDTO,
  ): Promise<ValidateSparePartOrderResponseDTO> {

    return this.validateSparePartOrderUseCase.execute({
      ...dto,
      userId: req.user.userId,
      userRole: req.user.role,
    });
  }
}
