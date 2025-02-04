import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { GetCompaniesDTO } from '@application/dtos/company/request/GetCompaniesDTO';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { CompanyMapper } from '@application/mappers/CompanyMapper';
import { CompanyResponseDTO } from '@application/dtos/company/response/CompanyResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { Company } from '@domain/entities/CompanyEntity';

export class GetCompaniesUseCase implements IAuthorizationAware {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  public getAuthorizationContext(dto: GetCompaniesDTO): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      dealershipId: dto.userDealershipId,
      resourceType: 'company',
    };
  }

  @Authorize(Permission.VIEW_COMPANY_DETAILS)
  public async execute(
    dto: GetCompaniesDTO,
  ): Promise<Result<CompanyResponseDTO[], Error>> {
    try {
      let companies: Company[] = [];

      // Si c'est un admin, il peut voir toutes les entreprises
      if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
        companies = dto.includeInactive
          ? await this.companyRepository.findAll()
          : await this.companyRepository.findActive();
      }
      // Si c'est un manager de concession, il ne peut voir que les entreprises de sa concession
      else if (
        dto.userRole === UserRole.DEALERSHIP_MANAGER &&
        dto.userDealershipId
      ) {
        companies = await this.companyRepository.findByDealershipId(
          dto.userDealershipId,
        );
        if (!dto.includeInactive) {
          companies = companies.filter((company) => company.isActive);
        }
      }
      // Pour les autres rôles, retourner une liste vide ou gérer selon les besoins
      else {
        companies = [];
      }

      // Mapper les résultats vers le DTO de réponse
      return companies.map((company) => CompanyMapper.toDTO(company));
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving companies',
      );
    }
  }
}
