// src/application/use-cases/dealership/GetDealershipsUseCase.ts
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipsDTO } from '@application/dtos/dealership/GetDealershipsDTO';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';

export class GetDealershipsUseCase implements IAuthorizationAware {
    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: GetDealershipsDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole
        };
    }

    @Authorize(Permission.VIEW_ALL_DEALERSHIPS) 
    public async execute(dto: GetDealershipsDTO): Promise<Result<Dealership[], Error>> {
        if (dto.includeInactive) {
            return this.dealershipRepository.findAll();
        }
        return this.dealershipRepository.findActive();
    }
}