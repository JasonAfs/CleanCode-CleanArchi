import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { DeactivateDealershipDTO } from '@application/dtos/dealership/request/DeactivateDealershipDTO';
import { DeactivateDealershipValidator } from '@application/validation/dealership/DeactivateDealershipValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { UserRole } from '@domain/enums/UserRole';
import { DeactivateDealershipResponseDTO } from '@application/dtos/dealership/response/DeactivateDealershipResponseDTO';

export class DeactivateDealershipUseCase implements IAuthorizationAware {
    private readonly validator = new DeactivateDealershipValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: DeactivateDealershipDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.MANAGE_ALL_DEALERSHIPS)
    public async execute(dto: DeactivateDealershipDTO): Promise<Result<DeactivateDealershipResponseDTO, Error>> {
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
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Étape 3: Vérification de l'état actuel
            if (!dealership.isActive) {
                return new DealershipValidationError('Dealership is already deactivated');
            }

            // Étape 4: Vérification des droits d'accès pour les managers
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && 
                !dealership.hasEmployee(dto.userId)) {
                return new UnauthorizedError("You don't have access to this dealership");
            }

            // Étape 5: Désactivation et sauvegarde
            dealership.deactivate();
            await this.dealershipRepository.update(dealership);

            return {
                success: true,
                message: `Dealership ${dealership.name} has been successfully deactivated`,
                dealershipId: dealership.id
            };
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while deactivating the dealership');
        }
    }
}