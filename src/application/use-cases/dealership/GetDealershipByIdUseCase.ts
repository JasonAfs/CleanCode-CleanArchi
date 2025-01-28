import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipByIdValidator } from '@application/validation/dealership/GetDealershipByIdValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { GetDealershipByIdDTO } from '@application/dtos/dealership/etDealershipByIdDTO';


export interface GetDealershipByIdUseCaseDTO extends GetDealershipByIdDTO {
    userId: string;
    userRole: UserRole;
}

export class GetDealershipByIdUseCase implements IAuthorizationAware {
    private readonly validator = new GetDealershipByIdValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: GetDealershipByIdUseCaseDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize([Permission.VIEW_ALL_DEALERSHIPS, Permission.VIEW_DEALERSHIP_DETAILS])
    public async execute(dto: GetDealershipByIdUseCaseDTO): Promise<Result<Dealership, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Les admins ont accès à toutes les concessions
            if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
                return dealership;
            }

            // Pour les managers/employés de concession, vérifier qu'ils appartiennent à cette concession
            const dealershipRoles = [
                UserRole.DEALERSHIP_MANAGER, 
                UserRole.DEALERSHIP_EMPLOYEE, 
                UserRole.DEALERSHIP_TECHNICIAN,
                UserRole.DEALERSHIP_STOCK_MANAGER
            ];

            if (dealershipRoles.includes(dto.userRole)) {
                if (!dealership.hasEmployee(dto.userId)) {
                    return new UnauthorizedError("You don't have access to this dealership");
                }
                return dealership;
            }

            // Les autres rôles n'ont pas accès aux détails des concessions
            return new UnauthorizedError("Unauthorized to view dealership details");

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving the dealership');
        }
    }
}