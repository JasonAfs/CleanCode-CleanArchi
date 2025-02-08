// src/application/use-cases/motorcycle/TransferMotorcycleToDealershipUseCase.ts
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { TransferMotorcycleToDealershipDTO } from '@application/dtos/motorcycle/request/TransferMotorcycleToDealershipDTO';
import { TransferMotorcycleResponseDTO } from '@application/dtos/motorcycle/response/TransferMotorcycleResponseDTO';
import { TransferMotorcycleValidator } from '@application/validation/motorcycle/TransferMotorcycleValidator';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import {
  MotorcycleNotFoundError,
  MotorcycleValidationError,
} from '@domain/errors/motorcycle/MotorcycleValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class TransferMotorcycleToDealershipUseCase {
  private readonly validator = new TransferMotorcycleValidator();

  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly dealershipRepository: IDealershipRepository,
  ) {}

  public async execute(
    dto: TransferMotorcycleToDealershipDTO,
  ): Promise<Result<TransferMotorcycleResponseDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
        return new UnauthorizedError(
          'Only TRIUMPH_ADMIN can transfer motorcycles',
        );
      }

      // 2. Validation des données d'entrée
      try {
        this.validator.validate(dto);
      } catch (error) {
        if (error instanceof MotorcycleValidationError) {
          return error;
        }
        throw error;
      }

      // 3. Récupération de la moto
      const motorcycle = await this.motorcycleRepository.findById(
        dto.motorcycleId,
      );
      if (!motorcycle) {
        return new MotorcycleNotFoundError(dto.motorcycleId);
      }

      // 4. Vérification de la concession cible
      const targetDealership = await this.dealershipRepository.findById(
        dto.targetDealershipId,
      );
      if (!targetDealership) {
        return new DealershipNotFoundError(dto.targetDealershipId);
      }

      // 5. Vérification que la concession cible est active
      if (!targetDealership.isActive) {
        return new DealershipValidationError(
          'Cannot transfer motorcycle to an inactive dealership',
        );
      }

      // 6. Sauvegarde de l'ancien dealershipId
      const previousDealershipId = motorcycle.dealershipId;

      // 7. Transfert de la moto
      try {
        motorcycle.transferToDealership(dto.targetDealershipId);
      } catch (error) {
        if (error instanceof Error) {
          return error;
        }
        throw error;
      }

      // 8. Persistence
      await this.motorcycleRepository.update(motorcycle);

      // 9. Retour de la réponse
      return {
        success: true,
        message: `Motorcycle successfully transferred to dealership ${targetDealership.name}`,
        motorcycleId: motorcycle.id,
        previousDealershipId: previousDealershipId!,
        newDealershipId: dto.targetDealershipId,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while transferring the motorcycle',
      );
    }
  }
}
