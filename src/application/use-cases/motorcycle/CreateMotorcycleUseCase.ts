import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { CreateMotorcycleDTO } from '@application/dtos/motorcycle/request/CreateMotorcycleDTO';
import { CreateMotorcycleValidator } from '@application/validation/motorcycle/CreateMotorcycleValidator';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { VIN } from '@domain/value-objects/VIN';
import { Model } from '@domain/value-objects/Model';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { CreateMotorcycleResponseDTO } from '@application/dtos/motorcycle/response/CreateMotorcycleResponseDTO';

export class CreateMotorcycleUseCase {
  private readonly validator = new CreateMotorcycleValidator();

  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly dealershipRepository: IDealershipRepository,
  ) {}

  public async execute(
    dto: CreateMotorcycleDTO,
  ): Promise<Result<CreateMotorcycleResponseDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
        return new UnauthorizedError(
          'Only TRIUMPH_ADMIN can create motorcycles',
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

      // 3. Vérifier si le VIN existe déjà
      const vin = VIN.create(dto.vin);
      const exists = await this.motorcycleRepository.exists(vin);
      if (exists) {
        return new MotorcycleValidationError(
          `Motorcycle with VIN ${dto.vin} already exists`,
        );
      }

      // 4. Vérifier si la concession existe
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // 5. Création des value objects
      const model = Model.create(dto.modelType, dto.year);

      // 6. Création de l'entité Motorcycle
      const motorcycle = Motorcycle.create({
        vin,
        model,
        color: dto.color.trim(),
        mileage: dto.mileage,
        dealershipId: dto.dealershipId,
      });

      // 7. Persistence
      await this.motorcycleRepository.create(motorcycle);

      // 8. Retour de la réponse
      return {
        success: true,
        message: `Motorcycle with VIN ${motorcycle.vin.toString()} has been successfully created`,
        motorcycleId: motorcycle.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while creating the motorcycle',
      );
    }
  }
}
