import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { DeactivateDealershipDTO } from '@application/dtos/dealership/DeactivateDealershipDTO';
import { DeactivateDealershipValidator } from '@application/validation/dealership/DeactivateDealershipValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserRole } from '@domain/enums/UserRole';


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
    public async execute(dto: DeactivateDealershipDTO): Promise<Result<void, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Vérifier que la concession n'est pas déjà désactivée
            if (!dealership.isActive) {
                return new Error('Dealership is already deactivated');
            }

            // Vérifier les droits d'accès pour les managers
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && 
                !dealership.hasEmployee(dto.userId)) {
                return new UnauthorizedError("You don't have access to this dealership");
            }

            // Désactiver la concession
            dealership.deactivate();

            // Sauvegarder les modifications
            await this.dealershipRepository.update(dealership);

            return;
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while deactivating the dealership');
        }
    }
}