import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { Result } from '@domain/shared/Result';
import { Company } from '@domain/entities/CompanyEntity';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserRole } from '@domain/enums/UserRole';
import { Permission } from '@domain/services/authorization/Permission';
import { ROLE_PERMISSIONS } from '@domain/services/authorization/PermissionRegistry';
import { GetCompanyByIdDTO } from '@application/dtos/company/request/GetCompanyByIdDTO';
import { CompanyMapper } from '@application/mappers/CompanyMapper';
import { CompanyResponseDTO } from '@application/dtos/company/response/CompanyResponseDTO';

export class GetCompanyByIdUseCase {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS.get(role);
    return permissions?.has(permission) ?? false;
  }

  public async execute(
    dto: GetCompanyByIdDTO,
  ): Promise<Result<CompanyResponseDTO, Error>> {
    try {
      // 1. Vérification des permissions
      if (!this.hasPermission(dto.userRole, Permission.VIEW_COMPANY_DETAILS)) {
        return new UnauthorizedError(
          "You don't have permission to view company details",
        );
      }

      // 2. Récupération de la company
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
          // Le manager ne peut voir que les companies de sa concession
          if (!company.belongsToDealership(dto.userDealershipId)) {
            return new UnauthorizedError(
              "You don't have access to this company",
            );
          }
          break;

        case UserRole.COMPANY_MANAGER:
          // Le manager de company ne peut voir que sa propre company
          if (company.id !== dto.userCompanyId) {
            return new UnauthorizedError('You can only view your own company');
          }
          break;

        default:
          return new UnauthorizedError(
            'Role not authorized to view company details',
          );
      }

      // Utilisation du mapper pour transformer l'entité en DTO
      return CompanyMapper.toDTO(company);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving company details',
      );
    }
  }
}
