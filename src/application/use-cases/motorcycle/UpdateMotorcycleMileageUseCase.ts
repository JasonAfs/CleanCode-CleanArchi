import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { UpdateMotorcycleMileageDTO } from '@application/dtos/motorcycle/request/UpdateMotorcycleMileageDTO';
import { UpdateMotorcycleMileageValidator } from '@application/validation/motorcycle/UpdateMotorcycleMileageValidator';
import { Result } from '@domain/shared/Result';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UpdateMotorcycleMileageResponseDTO } from '@application/dtos/motorcycle/response/UpdateMotorcycleMileageResponseDTO';

export class UpdateMotorcycleMileageUseCase {
    private readonly validator = new UpdateMotorcycleMileageValidator();

    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly dealershipRepository: IDealershipRepository,
    ) {}

    public async execute(
        dto: UpdateMotorcycleMileageDTO,
    ): Promise<Result<UpdateMotorcycleMileageResponseDTO, Error>> {
        try {
            // 1. Validation des données d'entrée et permissions
            try {
                this.validator.validate(dto);
            } catch (error) {
                if (error instanceof Error) {
                    return error;
                }
                throw error;
            }

            // 2. Récupération de la moto
            const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
            if (!motorcycle) {
                return new MotorcycleNotFoundError(dto.motorcycleId);
            }

            // 3. Vérification que l'employé appartient à la bonne concession
            if (!motorcycle.dealershipId || motorcycle.dealershipId !== dto.userDealershipId) {
                return new UnauthorizedError("You don't have access to update this motorcycle's mileage");
            }

            const previousMileage = motorcycle.mileage;
            // 4. Mise à jour du kilométrage
            try {
                motorcycle.updateMileage(dto.mileage);
            } catch (error) {
                if (error instanceof Error) {
                    return error;
                }
                throw error;
            }

            // 5. Persistence
            await this.motorcycleRepository.updateMileage(motorcycle.id, dto.mileage);

            // 6. Retour de la réponse
            return {
                success: true,
                message: `Motorcycle mileage has been successfully updated`,
                motorcycleId: motorcycle.id,
                previousMileage: previousMileage,
                newMileage: dto.mileage
            };
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while updating motorcycle mileage');
        }
    }
}