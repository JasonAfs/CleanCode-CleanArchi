import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from "@domain/services/authorization/IAuthorizationAware";
import { RemoveCompanyEmployeeValidator } from '@application/validation/company/RemoveCompanyEmployeeValidator';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { RemoveCompanyEmployeeDTO } from '@application/dtos/company/request/RemoveCompanyEmployeeDTO';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Result } from '@domain/shared/Result';
import { Permission } from '@domain/services/authorization/Permission';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { RemoveCompanyEmployeeResponseDTO } from '@application/dtos/company/response/RemoveCompanyEmployeeResponseDTO';
import { UserRole } from '@domain/enums/UserRole';

export class RemoveCompanyEmployeeUseCase implements IAuthorizationAware {
    private readonly validator = new RemoveCompanyEmployeeValidator();

    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly userRepository: IUserRepository,
    ) {
    }

    public getAuthorizationContext(dto: RemoveCompanyEmployeeDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId,
            resourceType: 'company',
            resourceId: dto.companyId
        };
    }

    @Authorize(Permission.MANAGE_COMPANY_USERS)
    public async execute(dto: RemoveCompanyEmployeeDTO): Promise<Result<RemoveCompanyEmployeeResponseDTO, Error>> {
        try {
            // Étape 1: Validation des données d'entrée
            try {
                this.validator.validate(dto);
            } catch (error) {
                if (error instanceof CompanyValidationError) {
                    return error;
                }
                throw error;
            }

            // Étape 2: Récupérer l'entreprise
            const company = await this.companyRepository.findById(dto.companyId);
            if (!company) {
                return new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
            }


            // Étape 4: Vérifier que l'employé existe
            const employee = await this.userRepository.findById(dto.employeeId);
            if (!employee) {
                return new UserNotFoundError(dto.employeeId);
            }

            // Étape 5: Vérifier que l'employé appartient bien à cette entreprise
            if (!company.hasEmployee(dto.employeeId)) {
                return new CompanyValidationError('Employee is not associated with this company');
            }

            // Étape 6: Vérification des règles métier pour les managers
            if (employee.role === UserRole.COMPANY_MANAGER) {
                const remainingManagers = company.employees.getByRole(UserRole.COMPANY_MANAGER)
                    .filter(manager => manager.id !== dto.employeeId);
                
                if (remainingManagers.length === 0) {
                    return new CompanyValidationError('Cannot remove the last manager of a company');
                }
            }

            // Étape 7: Retirer l'employé de l'entreprise
            company.removeEmployee(dto.employeeId);
            await this.companyRepository.update(company);

            // Étape 8: Réinitialiser le rôle de l'employé
            employee.updateRole(UserRole.CLIENT);
            await this.userRepository.update(employee);

            return {
                success: true,
                message: `Employee ${employee.firstName} ${employee.lastName} has been successfully removed from company ${company.name}`,
                companyId: company.id,
                removedEmployeeId: employee.id,
                remainingEmployeesCount: company.employees.getAll().length
            };

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while removing employee from company');
        }
    }
}