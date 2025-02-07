import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AddDealershipEmployeeValidator } from '@application/validation/dealership/AddDealershipEmployeeValidator';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { AddDealershipEmployeeDTO } from '@application/dtos/dealership/request/AddDealershipEmployeeDTO';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Result } from '@domain/shared/Result';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { Permission } from '@domain/services/authorization/Permission';
import { AddDealershipEmployeeResponseDTO } from '@application/dtos/dealership/response/AddDealershipEmployeeResponseDTO';

export class AddDealershipEmployeeUseCase implements IAuthorizationAware {
  private readonly validator = new AddDealershipEmployeeValidator();

  constructor(
    private readonly dealershipRepository: IDealershipRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  public getAuthorizationContext(
    dto: AddDealershipEmployeeDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      resourceId: dto.dealershipId,
      dealershipId: dto.userDealershipId,
      resourceType: 'dealership',
    };
  }

  @Authorize(Permission.MANAGE_DEALERSHIP_EMPLOYEES)
  public async execute(
    dto: AddDealershipEmployeeDTO,
  ): Promise<Result<AddDealershipEmployeeResponseDTO, Error>> {
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

      // Étape 2: Récupérer la concession
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // Étape 3: Vérifier que l'employé existe
      const employee = await this.userRepository.findById(dto.employeeId);
      if (!employee) {
        return new UserNotFoundError(dto.employeeId);
      }

      // Étape 4: Vérifier si l'employé n'est pas déjà associé à une autre concession
      const existingDealership = await this.dealershipRepository.findByEmployee(
        dto.employeeId,
      );
      if (existingDealership && existingDealership.id !== dto.dealershipId) {
        return new DealershipValidationError(
          'Employee is already associated with another dealership',
        );
      }

      // Étape 5: Mettre à jour le rôle de l'employé
      employee.updateRole(dto.role);
      await this.userRepository.update(employee);

      // Étape 6: Ajouter l'employé à la concession
      dealership.addEmployee(employee);
      await this.dealershipRepository.update(dealership);

      return {
        success: true,
        message: `Employee ${employee.firstName} ${employee.lastName} has been successfully added to dealership ${dealership.name}`,
        dealershipId: dealership.id,
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
        'An unexpected error occurred while adding employee to dealership',
      );
    }
  }
}
