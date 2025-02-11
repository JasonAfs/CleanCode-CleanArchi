import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { DeactivateCompanyDTO } from '@application/dtos/company/request/DeactivateCompanyDTO';
import { DeactivateCompanyValidator } from '@application/validation/company/DeactivateCompanyValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { DeactivateCompanyResponseDTO } from '@application/dtos/company/response/DeactivateCompanyResponseDTO';
import { UserRole } from '@domain/enums/UserRole';

export class DeactivateCompanyUseCase implements IAuthorizationAware {
  private readonly validator = new DeactivateCompanyValidator();

  constructor(private readonly companyRepository: ICompanyRepository) {}

  public getAuthorizationContext(
    dto: DeactivateCompanyDTO,
  ): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      dealershipId: dto.dealershipId,
      resourceType: 'company',
      resourceId: dto.companyId,
    };
  }

  @Authorize(Permission.MANAGE_COMPANY)
  public async execute(
    dto: DeactivateCompanyDTO,
  ): Promise<Result<DeactivateCompanyResponseDTO, Error>> {
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

      // Étape 2: Récupération de l'entreprise
      const company = await this.companyRepository.findById(dto.companyId);
      if (!company) {
        return new CompanyValidationError(
          `Company not found with id: ${dto.companyId}`,
        );
      }

      // Ajouter la vérification de la concession
      if (
        dto.userRole !== UserRole.TRIUMPH_ADMIN &&
        !company.belongsToDealership(dto.dealershipId)
      ) {
        return new UnauthorizedError(
          "You don't have access to deactivate this company",
        );
      }

      // Étape 3: Vérification de l'état actuel
      if (!company.isActive) {
        return new CompanyValidationError('Company is already deactivated');
      }

      // Étape 6: Désactivation et sauvegarde
      company.deactivate();
      await this.companyRepository.update(company);

      return {
        success: true,
        message: `Company ${company.name} has been successfully deactivated`,
        companyId: company.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while deactivating the company',
      );
    }
  }
}
