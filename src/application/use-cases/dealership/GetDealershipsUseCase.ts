import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipsDTO } from '@application/dtos/dealership/request/GetDealershipsDTO';
import { GetDealershipsValidator } from '@application/validation/dealership/GetDealershipsValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Result } from '@domain/shared/Result';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DealershipAuthorizationService } from '@domain/services/authorization/DealershipAuthorizationService';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipMapper } from '@application/mappers/DealershipMapper';
import { DealershipWithEmployeesDTO } from '@application/dtos/dealership/response/DealershipWithEmployeesDTO';

export class GetDealershipsUseCase implements IAuthorizationAware {
    private readonly validator = new GetDealershipsValidator();
    private readonly authService: DealershipAuthorizationService;

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        authService?: DealershipAuthorizationService
    ) {
        this.authService = authService ?? new DealershipAuthorizationService();
    }

    public getAuthorizationContext(dto: GetDealershipsDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole
        };
    }

    @Authorize([Permission.VIEW_ALL_DEALERSHIPS, Permission.VIEW_DEALERSHIP_DETAILS])
    public async execute(dto: GetDealershipsDTO): Promise<Result<DealershipWithEmployeesDTO[], Error>> {
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

            // Étape 2: Obtention des concessions selon le rôle
            if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
                const dealerships = dto.includeInactive ? 
                    await this.dealershipRepository.findAll() : 
                    await this.dealershipRepository.findActive();
                console.log("DEBUG"+JSON.stringify(dealerships))
                return dealerships.map(dealership => DealershipMapper.toDTOWithEmployees(dealership));
            }

            // Étape 3: Gestion des rôles de concession
            if (this.authService.isDealershipRole(dto.userRole)) {
                const dealership = await this.dealershipRepository.findByEmployee(dto.userId);
                
                if (!dealership) {
                    return new UnauthorizedError(`${dto.userRole} not associated with any dealership`);
                }
                
                return [DealershipMapper.toDTOWithEmployees(dealership)];
            }

            // Étape 4: Gestion des rôles non autorisés
            return new UnauthorizedError("Unauthorized to view dealerships");

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving dealerships');
        }
    }
}