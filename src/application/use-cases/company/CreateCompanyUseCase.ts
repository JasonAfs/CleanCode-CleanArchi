import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { CreateCompanyDTO } from '@application/dtos/company/request/CreateCompanyDTO';
import { CreateCompanyValidator } from '@application/validation/company/CreateCompanyValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { Company } from '@domain/entities/CompanyEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { CompanyMapper } from '@application/mappers/CompanyMapper';
import { CompanyResponseDTO } from '@application/dtos/company/response/CompanyResponseDTO';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';

export class CreateCompanyUseCase implements IAuthorizationAware {
  private readonly validator = new CreateCompanyValidator();

  constructor(private readonly companyRepository: ICompanyRepository) {}

  public getAuthorizationContext(dto: CreateCompanyDTO): AuthorizationContext {
    return {
      userId: dto.userId,
      userRole: dto.userRole,
      dealershipId: dto.dealershipId,
      resourceType: 'company', // Ajout du type
    };
  }

  @Authorize(Permission.MANAGE_COMPANY)
  public async execute(
    dto: CreateCompanyDTO,
  ): Promise<Result<CompanyResponseDTO, Error>> {
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

      // Étape 2: Vérification si l'entreprise existe déjà
      const registrationNumber = RegistrationNumber.create(
        dto.registrationNumber,
      );
      const exists = await this.companyRepository.exists(registrationNumber);
      if (exists) {
        return new CompanyValidationError(
          `Company with registration number ${dto.registrationNumber} already exists`,
        );
      }

      // Étape 3: Création des value objects
      const address = Address.create(
        dto.street.trim(),
        dto.city.trim(),
        dto.postalCode.trim(),
        dto.country.trim(),
      );

      const contactInfo = ContactInfo.create(
        dto.phone.trim(),
        new Email(dto.email.trim()),
      );

      // Étape 4: Création de l'entité Company
      const company = Company.create({
        name: dto.name.trim(),
        registrationNumber,
        address,
        contactInfo,
        createdByDealershipId: dto.dealershipId,
      });

      // Étape 5: Persistence
      await this.companyRepository.create(company);

      // Étape 6: Retourner la réponse formatée
      return CompanyMapper.toDTO(company);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while creating the company',
      );
    }
  }
}
