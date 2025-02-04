import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AddCompanyEmployeeValidator } from '@application/validation/company/AddCompanyEmployeeValidator';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { AddCompanyEmployeeDTO } from '@application/dtos/company/request/AddCompanyEmployeeDTO';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Result } from '@domain/shared/Result';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { AddCompanyEmployeeResponseDTO } from '@application/dtos/company/response/AddCompanyEmployeeResponseDTO';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';

export class AddCompanyEmployeeUseCase implements IAuthorizationAware {
  private readonly validator = new AddCompanyEmployeeValidator();

  constructor(
    private readonly companyRepository: ICompanyRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  public getAuthorizationContext(
    dto: AddCompanyEmployeeDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      dealershipId: dto.dealershipId,
      resourceType: 'company',
      resourceId: dto.companyId,
    };
  }

  @Authorize(Permission.MANAGE_COMPANY_USERS)
  public async execute(
    dto: AddCompanyEmployeeDTO,
  ): Promise<Result<AddCompanyEmployeeResponseDTO, Error>> {
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

      // Étape 3: Récupérer l'entreprise
      const company = await this.companyRepository.findById(dto.companyId);
      if (!company) {
        return new CompanyValidationError(
          `Company not found with id: ${dto.companyId}`,
        );
      }

      // Ajouter la vérification de la concession
      if (
        dto.userRole !== UserRole.TRIUMPH_ADMIN &&
        dto.userRole !== UserRole.COMPANY_MANAGER &&
        !company.belongsToDealership(dto.dealershipId)
      ) {
        return new UnauthorizedError(
          "You don't have access to manage this company's employees",
        );
      }

      // Étape 5: Vérifier que l'employé existe
      const employee = await this.userRepository.findById(dto.employeeId);
      if (!employee) {
        return new UserNotFoundError(dto.employeeId);
      }

      // Étape 6: Vérifier si l'employé n'est pas déjà associé à une autre entreprise
      const existingCompany = await this.companyRepository.findByEmployeeId(
        dto.employeeId,
      );
      if (existingCompany && existingCompany.id !== dto.companyId) {
        return new CompanyValidationError(
          'Employee is already associated with another company',
        );
      }

      // Étape 7: Mettre à jour le rôle de l'employé
      employee.updateRole(dto.role);
      await this.userRepository.update(employee);

      // Étape 8: Ajouter l'employé à l'entreprise
      company.addEmployee(employee);
      await this.companyRepository.update(company);

      return {
        success: true,
        message: `Employee ${employee.firstName} ${employee.lastName} has been successfully added to company ${company.name}`,
        companyId: company.id,
        employee: {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email.toString(),
          role: employee.role,
          isActive: employee.isActive,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while adding employee to company',
      );
    }
  }
}
