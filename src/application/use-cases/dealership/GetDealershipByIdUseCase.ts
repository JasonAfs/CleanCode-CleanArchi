import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { GetDealershipByIdDTO } from '@application/dtos/dealership/request/GetDealershipByIdDTO';
import { GetDealershipByIdValidator } from '@application/validation/dealership/GetDealershipByIdValidator';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipMapper } from '@application/mappers/DealershipMapper';
import { DealershipWithEmployeesDTO } from '@application/dtos/dealership/response/DealershipWithEmployeesDTO';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { UserRole } from '@domain/enums/UserRole';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';

export class GetDealershipByIdUseCase {
  private readonly validator = new GetDealershipByIdValidator();

  constructor(
    private readonly dealershipRepository: IDealershipRepository,
    private readonly userRepository : IUserRepository
  ) {}

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS.get(role);
    return permissions?.has(permission) ?? false;
  }


  public async execute(
    dto: GetDealershipByIdDTO,
  ): Promise<Result<DealershipWithEmployeesDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (!this.hasPermission(dto.userRole, Permission.VIEW_DEALERSHIP_DETAILS)) {
        return new UnauthorizedError("You don't have permission to view dealership details");
      }

      // 2. Si ce n'est pas un admin, vérifier l'appartenance à la concession
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN && dto.userDealershipId !== dto.dealershipId) {
        return new UnauthorizedError("You don't have access to this dealership");
      }

      // 3. Validation des données d'entrée
      try {
        this.validator.validate(dto);
      } catch (error) {
        if (error instanceof DealershipValidationError) {
          return error;
        }
        throw error;
      }

      // 4. Récupération de la concession
      const dealership = await this.dealershipRepository.findById(dto.dealershipId);
      if (!dealership) {
        return new DealershipNotFoundError(dto.dealershipId);
      }

      // 5. Retour des données
      return DealershipMapper.toDTOWithEmployees(dealership);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error('An unexpected error occurred while retrieving the dealership');
    }
  }
}

