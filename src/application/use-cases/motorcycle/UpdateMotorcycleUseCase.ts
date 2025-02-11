import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { UpdateMotorcycleDTO } from '@application/dtos/motorcycle/request/UpdateMotorcycleDTO';
import { UpdateMotorcycleValidator } from '@application/validation/motorcycle/UpdateMotorcycleValidator';
import { Result } from '@domain/shared/Result';
import { MotorcycleResponseDTO } from '@application/dtos/motorcycle/response/MotorcycleResponseDTO';
import { MotorcycleMapper } from '@application/mappers/MotorcycleMapper';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { VIN } from '@domain/value-objects/VIN';
import { Model } from '@domain/value-objects/Model';
import {
  MotorcycleValidationError,
  MotorcycleNotFoundError,
} from '@domain/errors/motorcycle/MotorcycleValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';

export class UpdateMotorcycleUseCase {
  private readonly validator = new UpdateMotorcycleValidator();

  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly dealershipRepository: IDealershipRepository,
  ) {}

  public async execute(
    dto: UpdateMotorcycleDTO,
  ): Promise<Result<MotorcycleResponseDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
        return new UnauthorizedError(
          'Only TRIUMPH_ADMIN can update motorcycles',
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

      // 3. Récupération de la moto existante
      const motorcycle = await this.motorcycleRepository.findById(
        dto.motorcycleId,
      );
      if (!motorcycle) {
        return new MotorcycleNotFoundError(
          `Motorcycle with id ${dto.motorcycleId} not found`,
        );
      }

      // 4. Mise à jour du VIN si fourni
      if (dto.vin) {
        const newVin = VIN.create(dto.vin);
        // Vérifier si le nouveau VIN n'existe pas déjà sur une autre moto
        const existingMotorcycle =
          await this.motorcycleRepository.findByVin(newVin);
        if (existingMotorcycle && existingMotorcycle.id !== motorcycle.id) {
          return new MotorcycleValidationError(
            `Motorcycle with VIN ${dto.vin} already exists`,
          );
        }
      }

      // 5. Vérification de la nouvelle concession si fournie
      if (dto.dealershipId) {
        const dealership = await this.dealershipRepository.findById(
          dto.dealershipId,
        );
        if (!dealership) {
          return new DealershipNotFoundError(dto.dealershipId);
        }
        motorcycle.transferToDealership(dto.dealershipId);
      }

      // 6. Mise à jour du modèle si fourni
      if (dto.modelType !== undefined && dto.year !== undefined) {
        try {
          motorcycle.updateModel(dto.modelType, dto.year);
        } catch (error) {
          if (error instanceof MotorcycleValidationError) {
            return error;
          }
          throw error;
        }
      }

      // 7. Mise à jour des autres propriétés
      if (dto.color) {
        motorcycle.updateColor(dto.color);
      }

      if (dto.mileage !== undefined) {
        motorcycle.updateMileage(dto.mileage);
      }

      // 8. Persistence
      await this.motorcycleRepository.update(motorcycle);

      // 9. Retour de la réponse
      return MotorcycleMapper.toDTO(motorcycle);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while updating the motorcycle',
      );
    }
  }
}
