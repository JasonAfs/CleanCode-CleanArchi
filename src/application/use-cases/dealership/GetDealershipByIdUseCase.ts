import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipByIdDTO } from '@application/dtos/dealership/request/GetDealershipByIdDTO';
import { GetDealershipByIdValidator } from '@application/validation/dealership/GetDealershipByIdValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipMapper } from '@application/mappers/DealershipMapper';
import { DealershipWithEmployeesDTO } from '@application/dtos/dealership/response/DealershipWithEmployeesDTO';

export class GetDealershipByIdUseCase implements IAuthorizationAware {
  private readonly validator = new GetDealershipByIdValidator();

  constructor(private readonly dealershipRepository: IDealershipRepository) {}

  public getAuthorizationContext(
    dto: GetDealershipByIdDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      resourceId: dto.dealershipId, // Important: resourceId au lieu de dealershipId
      resourceType: 'dealership',
    };
  }

  @Authorize(Permission.VIEW_DEALERSHIP_DETAILS)
  public async execute(
    dto: GetDealershipByIdDTO,
  ): Promise<Result<DealershipWithEmployeesDTO, Error>> {
    try {
      // Étape 1: Validation des données d'entrée
      try {
        this.validator.validate(dto);
      } catch (error) {
        if (error instanceof DealershipValidationError) {
          return error;
        }
        throw error;
      }

      // Étape 2: Récupération de la concession
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // Étape 3: Retourner les données
      return DealershipMapper.toDTOWithEmployees(dealership);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving the dealership',
      );
    }
  }
}
