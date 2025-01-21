import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { GetCompanyAssignedMotorcyclesDTO } from "@application/dtos/company/GetCompanyAssignedMotorcyclesDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { Motorcycle } from "@domain/entities/MotorcycleEntity";
import { UserRole } from "@domain/enums/UserRole";
import { Permission } from "@domain/services/authorization/Permission";
import { Authorize, IAuthorizationAware } from "@application/decorators/Authorize";
import { AuthorizationContext } from "@domain/services/authorization/AuthorizationContext";
import { UnauthorizedError } from "@domain/errors/authorization/UnauthorizedError";

export class GetCompanyAssignedMotorcyclesUseCase implements IAuthorizationAware {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly motorcycleRepository: IMotorcycleRepository
    ) {}

    public getAuthorizationContext(dto: GetCompanyAssignedMotorcyclesDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId,
            companyId: dto.companyId
        };
    }

    @Authorize(Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES)
    public async execute(dto: GetCompanyAssignedMotorcyclesDTO): Promise<Motorcycle[]> {
        // Vérifier que l'entreprise existe
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        // Vérification des droits d'accès
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN && 
            dto.userRole !== UserRole.COMPANY_MANAGER &&
            !company.belongsToDealership(dto.dealershipId)) {
            throw new UnauthorizedError("You don't have access to this company's motorcycles");
        }

        // Récupérer les assignations
        let assignments;
        if (dto.includeInactive) {
            assignments = await this.companyMotorcycleRepository.findByCompanyId(dto.companyId);
        } else {
            assignments = await this.companyMotorcycleRepository.findActiveByCompanyId(dto.companyId);
        }

        // Récupérer les motos pour chaque assignation
        const motorcycles = await Promise.all(
            assignments.map(assignment => 
                this.motorcycleRepository.findById(assignment.motorcycleId)
            )
        );

        // Filtrer les valeurs null (cas où une moto aurait été supprimée)
        return motorcycles.filter((motorcycle): motorcycle is Motorcycle => motorcycle !== null);
    }
}