import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { ReleaseMotorcycleFromCompanyDTO } from '@application/dtos/motorcycle/request/ReleaseMotorcycleFromCompanyDTO';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleNotFoundError, MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { ReleaseMotorcycleFromCompanyResponseDTO } from '@application/dtos/motorcycle/response/ReleaseMotorcycleFromCompanyResponseDTO';
import { ReleaseMotorcycleFromCompanyValidator } from '@application/validation/motorcycle/ReleaseMotorcycleFromCompanyValidator';

export class ReleaseMotorcycleFromCompanyUseCase {
    private readonly validator = new ReleaseMotorcycleFromCompanyValidator();

    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
    ) {}

    public async execute(
        dto: ReleaseMotorcycleFromCompanyDTO
    ): Promise<Result<ReleaseMotorcycleFromCompanyResponseDTO, Error>> {
        try {
            // 1. Vérification des permissions
            if (![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(dto.userRole)) {
                return new UnauthorizedError("Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can release motorcycles from companies");
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
            const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
            if (!motorcycle) {
                return new MotorcycleNotFoundError(dto.motorcycleId);
            }

            // 4. Vérifications spécifiques pour DEALERSHIP_MANAGER
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER) {
                if (motorcycle.dealershipId !== dto.dealershipId) {
                    return new UnauthorizedError("You don't have access to release this motorcycle");
                }
            }

            // 5. Vérifier que la moto est bien assignée à une company
            if (!motorcycle.companyId) {
                return new MotorcycleValidationError("Motorcycle is not assigned to any company");
            }

            const previousCompanyId = motorcycle.companyId;

            // 6. Libérer la moto de la company
            try {
                motorcycle.releaseFromCompany();
            } catch (error) {
                if (error instanceof Error) {
                    return error;
                }
                throw error;
            }

            // 7. Persistence
            await this.motorcycleRepository.update(motorcycle);

            // 8. Retour de la réponse
            return {
                success: true,
                message: `Motorcycle successfully released from company`,
                motorcycleId: motorcycle.id,
                previousCompanyId,
                dealershipId: motorcycle.dealershipId!
            };

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while releasing the motorcycle from company');
        }
    }
}