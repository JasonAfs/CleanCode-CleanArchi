import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { GetMotorcyclesDTO } from '@application/dtos/motorcycle/request/GetMotorcyclesDTO';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleResponseDTO } from '@application/dtos/motorcycle/response/MotorcycleResponseDTO';
import { MotorcycleMapper } from '@application/mappers/MotorcycleMapper';
import { Permission } from '@domain/services/authorization/Permission';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';

export class GetMotorcyclesUseCase {
  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS.get(role);
    return permissions?.has(permission) ?? false;
  }

  public async execute(
    dto: GetMotorcyclesDTO,
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

      // 2. Récupération de l'utilisateur pour vérifier ses associations
      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        return new UserNotFoundError(dto.userId);
      }
      let motorcycles = [];

      // 3. Logique de récupération selon le rôle
      switch (dto.userRole) {
        case UserRole.TRIUMPH_ADMIN:
          // L'admin voit toutes les motos
          motorcycles = await this.motorcycleRepository.findAll();
          break;

        case UserRole.DEALERSHIP_MANAGER:
          // Le manager de concession voit les motos de sa concession
          if (!user.dealershipId) {
            return new UnauthorizedError(
              'User is not associated with any dealership',
            );
          }
          motorcycles = await this.motorcycleRepository.findByDealership(
            user.dealershipId,
          );
          console.log(motorcycles.length);
          break;

        case UserRole.COMPANY_MANAGER:
          // Les utilisateurs d'entreprise voient les motos assignées à leur entreprise
          if (!user.companyId) {
            return new UnauthorizedError(
              'User is not associated with any company',
            );
          }
          motorcycles = await this.motorcycleRepository.findByCompany(
            user.companyId,
          );
          break;

        default:
          return new UnauthorizedError(
            'Role not authorized to view motorcycles',
          );
      }

      // 4. Application des filtres
      if (!dto.includeInactive) {
        motorcycles = motorcycles.filter((motorcycle) => motorcycle.isActive);
      }

      if (dto.statusFilter) {
        motorcycles = motorcycles.filter(
          (motorcycle) => motorcycle.status === dto.statusFilter,
        );
      }

      // 5. Mapping et retour des résultats
      return motorcycles.map((motorcycle) =>
        MotorcycleMapper.toDTO(motorcycle),
      );
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving motorcycles',
      );
    }
  }
}
