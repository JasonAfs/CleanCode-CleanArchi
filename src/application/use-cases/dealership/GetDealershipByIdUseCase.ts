import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipByIdDTO } from '@application/dtos/dealership/request/GetDealershipByIdDTO';
import { GetDealershipByIdValidator } from '@application/validation/dealership/GetDealershipByIdValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DealershipAuthorizationService } from '@domain/services/authorization/DealershipAuthorizationService';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipMapper } from '@application/mappers/DealershipMapper';
import { DealershipWithEmployeesDTO } from '@application/dtos/dealership/response/DealershipWithEmployeesDTO';

export class GetDealershipByIdUseCase implements IAuthorizationAware {
    private readonly validator = new GetDealershipByIdValidator();
    private readonly authService: DealershipAuthorizationService;

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        authService?: DealershipAuthorizationService
    ) {
        this.authService = authService ?? new DealershipAuthorizationService();
    }

    public getAuthorizationContext(dto: GetDealershipByIdDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize([Permission.VIEW_ALL_DEALERSHIPS, Permission.VIEW_DEALERSHIP_DETAILS])
    public async execute(dto: GetDealershipByIdDTO): Promise<Result<DealershipWithEmployeesDTO, Error>> {
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

            // Étape 3: Vérification des droits d'accès
            if (!this.authService.canAccessDealership(dto.userId, dto.userRole, dealership)) {
                return new UnauthorizedError("You don't have access to this dealership");
            }

            return DealershipMapper.toDTOWithEmployees(dealership);

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving the dealership');
        }
    }
}