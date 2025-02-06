import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { GetCompanyEmployeeHistoryDTO } from '@application/dtos/company/request/GetCompanyEmployeeHistoryDTO';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { Permission } from '@domain/services/authorization/Permission';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { Result } from '@domain/shared/Result';
import { CompanyEmployeeHistoryResponseDTO } from '@application/dtos/company/response/CompanyEmployeeHistoryResponseDTO';
import { UserMapper } from '@application/mappers/UserMapper';

export class GetCompanyEmployeeHistoryUseCase implements IAuthorizationAware {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  public getAuthorizationContext(
    dto: GetCompanyEmployeeHistoryDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      dealershipId: dto.dealershipId,
      companyId: dto.companyId,
    };
  }

  //@Authorize(Permission.VIEW_COMPANY_EMPLOYEES)
  public async execute(
    dto: GetCompanyEmployeeHistoryDTO,
  ): Promise<Result<CompanyEmployeeHistoryResponseDTO, Error>> {
    try {
      // Étape 1: Récupération de l'entreprise
      const company = await this.companyRepository.findById(dto.companyId);
      if (!company) {
        return new CompanyValidationError(
          `Company not found with id: ${dto.companyId}`,
        );
      }

      // Étape 3: Récupération des employés selon le filtre
      const allEmployees = company.employees.getAll();
      const employees = dto.includeInactive
        ? allEmployees
        : allEmployees.filter((employee) => employee.isActive);

      // Étape 4: Préparation de la réponse
      return {
        companyId: company.id,
        companyName: company.name,
        employees: employees.map((employee) => UserMapper.toDTO(employee)),
        activeEmployeesCount: allEmployees.filter((emp) => emp.isActive).length,
        totalEmployeesCount: allEmployees.length,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving company employees',
      );
    }
  }
}
