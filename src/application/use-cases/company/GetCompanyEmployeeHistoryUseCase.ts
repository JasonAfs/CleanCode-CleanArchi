import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { GetCompanyEmployeeHistoryDTO } from "@application/dtos/company/GetCompanyEmployeeHistoryDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { User } from "@domain/entities/UserEntity";
import { UserRole } from "@domain/enums/UserRole";
import { Permission } from "@domain/services/authorization/Permission";
import { Authorize, IAuthorizationAware } from "@application/decorators/Authorize";
import { AuthorizationContext } from "@domain/services/authorization/AuthorizationContext";
import { UnauthorizedError } from "@domain/errors/authorization/UnauthorizedError";

export class GetCompanyEmployeeHistoryUseCase implements IAuthorizationAware {
    constructor(
        private readonly companyRepository: ICompanyRepository
    ) {}

    public getAuthorizationContext(dto: GetCompanyEmployeeHistoryDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId,
            companyId: dto.companyId
        };
    }

    @Authorize(Permission.VIEW_COMPANY_EMPLOYEES)
    public async execute(dto: GetCompanyEmployeeHistoryDTO): Promise<User[]> {
        // Vérifier que l'entreprise existe
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        // Vérification des droits d'accès
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN && 
            dto.userRole !== UserRole.COMPANY_MANAGER &&
            !company.belongsToDealership(dto.dealershipId)) {
            throw new UnauthorizedError("You don't have access to this company's employees");
        }

        // Récupérer tous les employés ou uniquement les actifs selon le paramètre
        if (dto.includeInactive) {
            return company.employees.getAll();
        }
        
        // Filtrer pour ne retourner que les employés actifs
        return company.employees.getAll().filter(employee => employee.isActive);
    }
}