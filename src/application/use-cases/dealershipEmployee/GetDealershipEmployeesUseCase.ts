import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipEmployeesDTO } from '@application/dtos/dealership/request/GetDealershipEmployeesDTO';
import { GetDealershipEmployeesValidator } from '@application/validation/dealership/GetDealershipEmployeesValidator';
import { Result } from '@domain/shared/Result';
import { DealershipEmployeeResponseDTO } from '@application/dtos/dealership/response/DealershipEmployeeResponseDTO';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { Permission } from '@domain/services/authorization/Permission';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { UserRole } from '@domain/enums/UserRole';
import { UserMapper } from '@application/mappers/UserMapper';

export class GetDealershipEmployeesUseCase {
  private readonly validator = new GetDealershipEmployeesValidator();

  constructor(private readonly dealershipRepository: IDealershipRepository) {}

  public async execute(
    dto: GetDealershipEmployeesDTO,
  ): Promise<Result<DealershipEmployeeResponseDTO[], Error>> {
    try {
      // 1. Vérification des permissions
      const userPermissions = ROLE_PERMISSIONS.get(dto.userRole);
      if (!userPermissions?.has(Permission.VIEW_DEALERSHIP_DETAILS)) {
        return new UnauthorizedError(
          "You don't have permission to view dealership employees",
        );
      }

      // 2. Pour les managers de concession, vérifier qu'ils accèdent à leur propre concession
      if (
        dto.userRole === UserRole.DEALERSHIP_MANAGER &&
        dto.dealershipId !== dto.userDealershipId
      ) {
        return new UnauthorizedError(
          "You don't have access to this dealership's employees",
        );
      }

      // 3. Validation des données d'entrée
      try {
        this.validator.validate(dto);
      } catch (error) {
        if (error instanceof Error) {
          return error;
        }
        throw error;
      }

      // 4. Récupération de la concession
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // 5. Récupération et filtrage des employés
      let employees = dealership.employees.getAll();

      // Filtrage des employés inactifs si demandé
      if (!dto.includeInactive) {
        employees = employees.filter((employee) => employee.isActive);
      }

      // Filtrage par rôle si spécifié
      if (dto.roleFilter) {
        employees = employees.filter(
          (employee) => employee.role === dto.roleFilter,
        );
      }

      // 6. Mapping vers le DTO de réponse
      return employees.map((employee) => UserMapper.toDTO(employee));
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving dealership employees',
      );
    }
  }
}
