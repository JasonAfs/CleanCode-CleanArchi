import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipsDTO } from '@application/dtos/dealership/request/GetDealershipsDTO';
import { GetDealershipsValidator } from '@application/validation/dealership/GetDealershipsValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipMapper } from '@application/mappers/DealershipMapper';
import { DealershipWithEmployeesDTO } from '@application/dtos/dealership/response/DealershipWithEmployeesDTO';

export class GetDealershipsUseCase implements IAuthorizationAware {
    private readonly validator = new GetDealershipsValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: GetDealershipsDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            resourceType: 'dealership'
        };
    }

    @Authorize(Permission.VIEW_ALL_DEALERSHIPS) 
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

            // Étape 2: Récupération des concessions
            const dealerships = dto.includeInactive ? 
                await this.dealershipRepository.findAll() : 
                await this.dealershipRepository.findActive();

            // Étape 3: Mapping des résultats
            return dealerships.map(dealership => DealershipMapper.toDTOWithEmployees(dealership));

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving dealerships');
        }
    }
}