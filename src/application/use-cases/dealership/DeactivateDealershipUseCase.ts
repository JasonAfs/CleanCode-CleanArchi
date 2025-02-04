import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { DeactivateDealershipDTO } from '@application/dtos/dealership/request/DeactivateDealershipDTO';
import { DeactivateDealershipValidator } from '@application/validation/dealership/DeactivateDealershipValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DeactivateDealershipResponseDTO } from '@application/dtos/dealership/response/DeactivateDealershipResponseDTO';

export class DeactivateDealershipUseCase implements IAuthorizationAware {
  private readonly validator = new DeactivateDealershipValidator();

  constructor(private readonly dealershipRepository: IDealershipRepository) {}

  public getAuthorizationContext(
    dto: DeactivateDealershipDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      resourceId: dto.dealershipId,
      resourceType: 'dealership',
    };
  }

  @Authorize(Permission.MANAGE_ALL_DEALERSHIPS)
  public async execute(
    dto: DeactivateDealershipDTO,
  ): Promise<Result<DeactivateDealershipResponseDTO, Error>> {
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

      // Étape 3: Vérification de l'état actuel
      if (!dealership.isActive) {
        return new DealershipValidationError(
          'Dealership is already deactivated',
        );
      }

      // Étape 4: Désactivation et sauvegarde
      dealership.deactivate();
      await this.dealershipRepository.update(dealership);

      return {
        success: true,
        message: `Dealership ${dealership.name} has been successfully deactivated`,
        dealershipId: dealership.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while deactivating the dealership',
      );
    }
  }
}
