import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { ICompanyMotorcycleRepository } from '@application/ports/repositories/ICompanyMotorcycleRepository';
import { DeactivateCompanyDTO } from '@application/dtos/company/DeactivateCompanyDTO';
import { DeactivateCompanyValidator } from '@application/validation/company/DeactivateCompanyValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';

export class DeactivateCompanyUseCase implements IAuthorizationAware {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
    ) {}

    private readonly validator = new DeactivateCompanyValidator();

    public getAuthorizationContext(dto: DeactivateCompanyDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.DEACTIVATE_PARTNER_COMPANY)
    public async execute(dto: DeactivateCompanyDTO): Promise<void> {
        this.validator.validate(dto);

        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        if (dto.userRole !== UserRole.TRIUMPH_ADMIN && 
            !company.belongsToDealership(dto.dealershipId)) {
            throw new UnauthorizedError("You don't have access to this company");
        }

        if (!company.isActive) {
            throw new CompanyValidationError("Company is already inactive");
        }

        const activeAssignments = await this.companyMotorcycleRepository.findActiveByCompanyId(dto.companyId);
        if (activeAssignments.length > 0) {
            throw new CompanyValidationError("Cannot deactivate company with active motorcycle assignments");
        }

        company.deactivate();

        await this.companyRepository.update(company);
    }
}