import {
  Authorize,
  IAuthorizationAware,
} from '@application/decorators/Authorize';
import { AddDealershipEmployeeValidator } from '@application/validation/dealership/AddDealershipEmployeeValidator';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { AddDealershipEmployeeDTO } from '@application/dtos/dealership/request/AddDealershipEmployeeDTO';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Result } from '@domain/shared/Result';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { Permission } from '@domain/services/authorization/Permission';
import { DealershipAuthorizationService } from '@domain/services/authorization/DealershipAuthorizationService';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { AddDealershipEmployeeResponseDTO } from '@application/dtos/dealership/response/AddDealershipEmployeeResponseDTO';

export class AddDealershipEmployeeUseCase implements IAuthorizationAware {
  private readonly validator = new AddDealershipEmployeeValidator();
  private readonly authService = new DealershipAuthorizationService();

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
      dealershipId: dto.dealershipId,
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

      // Étape 2: Vérifier que le rôle à assigner est valide
      if (!this.authService.isDealershipRole(dto.role)) {
        return new DealershipValidationError('Invalid dealership role');
      }

      // Étape 3: Récupérer la concession
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // Étape 4: Vérifier les droits d'accès
      if (
        !this.authService.canAccessDealership(
          dto.userId,
          dto.userRole,
          dealership,
        )
      ) {
        return new UnauthorizedError(
          "You don't have access to this dealership",
        );
      }

      // Étape 5: Vérifier que l'employé existe
      const employee = await this.userRepository.findById(dto.employeeId);
      if (!employee) {
        return new UserNotFoundError(dto.employeeId);
      }

      // Étape 6: Vérifier si l'employé n'est pas déjà associé à une autre concession
      const existingDealership = await this.dealershipRepository.findByEmployee(
        dto.employeeId,
      );
      if (existingDealership && existingDealership.id !== dto.dealershipId) {
        return new DealershipValidationError(
          'Employee is already associated with another dealership',
        );
      }

      // Étape 7: Mettre à jour le rôle de l'employé
      employee.updateRole(dto.role);
      await this.userRepository.update(employee);

      // Étape 8: Ajouter l'employé à la concession
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
