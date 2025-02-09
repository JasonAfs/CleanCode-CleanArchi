import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { GetCompanyMotorcyclesDTO } from '@application/dtos/company/request/GetCompanyMotorcyclesDTO';
import { Result } from '@domain/shared/Result';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { MotorcycleResponseDTO } from '@application/dtos/motorcycle/response/MotorcycleResponseDTO';
import { MotorcycleMapper } from '@application/mappers/MotorcycleMapper';
import { Permission } from '@domain/services/authorization/Permission';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';

export class GetCompanyMotorcyclesUseCase {
  constructor(
    private readonly motorcycleRepository: IMotorcycleRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS.get(role);
    return permissions?.has(permission) ?? false;
  }

  public async execute(
    dto: GetCompanyMotorcyclesDTO,
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

      // 2. Vérification de l'existence de la company
      const company = await this.companyRepository.findById(dto.companyId);
      if (!company) {
        return new CompanyValidationError(
          `Company not found with id: ${dto.companyId}`,
        );
      }

      // 3. Vérification des accès selon le rôle
      switch (dto.userRole) {
        case UserRole.TRIUMPH_ADMIN:
          // L'admin a accès à toutes les companies
          break;

        case UserRole.DEALERSHIP_MANAGER:
          // Le manager ne peut voir que les motos des companies de sa concession
          if (!company.belongsToDealership(dto.userDealershipId)) {
            return new UnauthorizedError(
              "You don't have access to this company's motorcycles",
            );
          }
          break;

        case UserRole.COMPANY_MANAGER:
          // Le manager de company ne peut voir que les motos de sa propre company
          if (dto.companyId !== dto.userCompanyId) {
            return new UnauthorizedError(
              'You can only view motorcycles from your own company',
            );
          }
          break;

        default:
          return new UnauthorizedError(
            'Role not authorized to view company motorcycles',
          );
      }

      // 4. Récupération des motos
      let motorcycles = await this.motorcycleRepository.findByCompany(
        dto.companyId,
      );

      // 5. Application des filtres
      if (!dto.includeInactive) {
        motorcycles = motorcycles.filter((motorcycle) => motorcycle.isActive);
      }

      if (dto.statusFilter) {
        motorcycles = motorcycles.filter(
          (motorcycle) => motorcycle.status === dto.statusFilter,
        );
      }

      // 6. Mapping et retour des résultats
      return motorcycles.map((motorcycle) =>
        MotorcycleMapper.toDTO(motorcycle),
      );
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving company motorcycles',
      );
    }
  }
}
