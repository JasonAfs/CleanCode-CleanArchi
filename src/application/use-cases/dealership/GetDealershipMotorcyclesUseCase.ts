import { GetDealershipMotorcyclesDTO } from '@application/dtos/dealership/request/GetDealershipMotorcyclesDTO';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { MotorcycleResponseDTO } from '@application/dtos/motorcycle/response/MotorcycleResponseDTO';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleMapper } from '@application/mappers/MotorcycleMapper';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { Permission } from '@domain/services/authorization/Permission';

export class GetDealershipMotorcyclesUseCase {
  constructor(private readonly motorcycleRepository: IMotorcycleRepository) {}

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS.get(role);
    return permissions?.has(permission) ?? false;
  }

  public async execute(
    dto: GetDealershipMotorcyclesDTO,
  ): Promise<Result<MotorcycleResponseDTO[], Error>> {
    try {
      // 1. Vérification des permissions
      if (
        !this.hasPermission(dto.userRole, Permission.VIEW_MOTORCYCLE_DETAILS)
      ) {
        return new UnauthorizedError(
          "You don't have permission to view motorcycles",
        );
      }

      // 2. Déterminer quel ID de concession utiliser
      let dealershipIdToUse: string;

      if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
        // Pour un admin, utiliser l'ID passé en paramètre
        dealershipIdToUse = dto.dealershipId;
      } else {
        // Pour les autres rôles, vérifier qu'ils accèdent à leur propre concession
        if (!dto.userDealershipId) {
          return new UnauthorizedError(
            'User must be associated with a dealership',
          );
        }

        // Vérifier que l'utilisateur accède à sa propre concession
        if (dto.dealershipId !== dto.userDealershipId) {
          return new UnauthorizedError(
            'You can only view motorcycles from your own dealership',
          );
        }

        dealershipIdToUse = dto.userDealershipId;
      }

      // 4. Récupération des motos
      let motorcycles =
        await this.motorcycleRepository.findByDealership(dealershipIdToUse);

      // 5. Application des filtres
      if (!dto.includeInactive) {
        motorcycles = motorcycles.filter((motorcycle) => motorcycle.isActive);
      }

      if (dto.statusFilter) {
        motorcycles = motorcycles.filter(
          (motorcycle) => motorcycle.status === dto.statusFilter,
        );
      }

      // 6. Mapping vers le DTO de réponse
      return motorcycles.map((motorcycle) =>
        MotorcycleMapper.toDTO(motorcycle),
      );
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving dealership motorcycles',
      );
    }
  }
}
