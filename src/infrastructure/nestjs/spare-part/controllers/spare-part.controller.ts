import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { CreateSparePartRequestDTO } from '../dtos/request/create-spare-part.request.dto';
import { UpdateSparePartRequestDTO } from '../dtos/request/update-spare-part.request.dto';
import { GetSparePartsRequestDTO } from '../dtos/request/get-spare-parts.request.dto';

import { CreateSparePartUseCase } from '@application/use-cases/spare-part/CreateSparePartUseCase';
import { GetSparePartsUseCase } from '@application/use-cases/spare-part/GetSparePartsUseCase';
import { GetSparePartDetailsUseCase } from '@application/use-cases/spare-part/GetSparePartDetailsUseCase';
import { UpdateSparePartUseCase } from '@application/use-cases/spare-part/UpdateSparePartUseCase';
import { DeleteSparePartUseCase } from '@application/use-cases/spare-part/DeleteSparePartUseCase';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';

@ApiTags('spare-parts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('spare-parts')
export class SparePartController {
  constructor(
    private readonly createSparePartUseCase: CreateSparePartUseCase,
    private readonly getSparePartsUseCase: GetSparePartsUseCase,
    private readonly getSparePartDetailsUseCase: GetSparePartDetailsUseCase,
    private readonly updateSparePartUseCase: UpdateSparePartUseCase,
    private readonly deleteSparePartUseCase: DeleteSparePartUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Spare part created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSparePart(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateSparePartRequestDTO,
  ) {
    try {
      const result = await this.createSparePartUseCase.execute({
        ...dto,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof UnauthorizedError) {
        throw new UnauthorizedException(result.message);
      }
      if (result instanceof Error) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved spare parts successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSpareParts(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetSparePartsRequestDTO,
  ) {
    try {
      const result = await this.getSparePartsUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        ...query,
      });

      if (result instanceof UnauthorizedError) {
        throw new UnauthorizedException(result.message);
      }
      if (result instanceof Error) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Get(':reference')
  @ApiResponse({
    status: 200,
    description: 'Retrieved spare part details successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Spare part not found' })
  @ApiParam({ name: 'reference', type: String })
  async getSparePartDetails(
    @Request() req: AuthenticatedRequest,
    @Param('reference') reference: string,
  ) {
    try {
      const result = await this.getSparePartDetailsUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        reference,
      });

      if (result instanceof UnauthorizedError) {
        throw new UnauthorizedException(result.message);
      }
      if (result instanceof Error) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Put(':reference')
  @ApiResponse({ status: 200, description: 'Spare part updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Spare part not found' })
  @ApiParam({ name: 'reference', type: String })
  async updateSparePart(
    @Request() req: AuthenticatedRequest,
    @Param('reference') reference: string,
    @Body() dto: UpdateSparePartRequestDTO,
  ) {
    try {
      const result = await this.updateSparePartUseCase.execute({
        ...dto,
        reference,
        userId: req.user.userId,
        userRole: req.user.role,
      });

      if (result instanceof UnauthorizedError) {
        throw new UnauthorizedException(result.message);
      }
      if (result instanceof Error) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  @Delete(':reference')
  @ApiResponse({ status: 200, description: 'Spare part deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Spare part not found' })
  @ApiParam({ name: 'reference', type: String })
  async deleteSparePart(
    @Request() req: AuthenticatedRequest,
    @Param('reference') reference: string,
  ) {
    try {
      const result = await this.deleteSparePartUseCase.execute({
        userId: req.user.userId,
        userRole: req.user.role,
        reference,
      });

      return result;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
