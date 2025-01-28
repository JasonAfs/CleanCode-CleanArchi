import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipsDTO } from '@application/dtos/dealership/GetDealershipsDTO';
import { GetDealershipsValidator } from '@application/validation/dealership/GetDealershipsValidator'
import { Dealership } from '@domain/entities/DealershipEntity';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Result } from '@domain/shared/Result';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';

export class GetDealershipsUseCase implements IAuthorizationAware {
    private readonly validator = new GetDealershipsValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: GetDealershipsDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole
        };
    }

    @Authorize([Permission.VIEW_ALL_DEALERSHIPS, Permission.VIEW_DEALERSHIP_DETAILS])
    public async execute(dto: GetDealershipsDTO): Promise<Result<Dealership[], Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
                // Les admins peuvent voir toutes les concessions
                return dto.includeInactive ? 
                    await this.dealershipRepository.findAll() : 
                    await this.dealershipRepository.findActive();
            } 
            
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER) {
                // Les managers ne peuvent voir que leur concession
                const dealership = await this.dealershipRepository.findByEmployee(dto.userId);
                if (!dealership) {
                    return new UnauthorizedError("Manager not associated with any dealership");
                }
                return [dealership];
            }

            const dealershipRoles = [
                UserRole.DEALERSHIP_EMPLOYEE,
                UserRole.DEALERSHIP_TECHNICIAN,
                UserRole.DEALERSHIP_STOCK_MANAGER
            ];

            if (dealershipRoles.includes(dto.userRole)) {
                // Les employés ne peuvent voir que leur concession
                const dealership = await this.dealershipRepository.findByEmployee(dto.userId);
                if (!dealership) {
                    return new UnauthorizedError("Employee not associated with any dealership");
                }
                return [dealership];
            }

            return new UnauthorizedError("Unauthorized to view dealerships");
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving dealerships');
        }
    }
}