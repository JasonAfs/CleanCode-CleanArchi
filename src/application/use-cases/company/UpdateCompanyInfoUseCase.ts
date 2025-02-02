import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { UpdateCompanyInfoDTO } from '@application/dtos/company/UpdateCompanyInfoDTO';
import { UpdateCompanyInfoValidator } from '@application/validation/company/UpdateCompanyInfoValidator';
import { Authorize } from '@application/decorators/Authorize';
import { IAuthorizationAware } from "@domain/services/authorization/IAuthorizationAware";
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { UpdateCompanyInfoResponseDTO } from '@application/dtos/company/response/UpdateCompanyInfoResponseDTO';
import { UserRole } from '@domain/enums/UserRole';

export class UpdateCompanyInfoUseCase implements IAuthorizationAware {
    private readonly validator = new UpdateCompanyInfoValidator();

    constructor(
        private readonly companyRepository: ICompanyRepository,
    ) {
    }

    public getAuthorizationContext(dto: UpdateCompanyInfoDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId,
            resourceType: 'company',
            resourceId: dto.companyId
        };
    }

    @Authorize(Permission.MANAGE_COMPANY)
    public async execute(dto: UpdateCompanyInfoDTO): Promise<Result<UpdateCompanyInfoResponseDTO, Error>> {
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
                return new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
            }

            // Ajouter la vérification de la concession
        if (dto.userRole !== UserRole.TRIUMPH_ADMIN 
            && !company.belongsToDealership(dto.dealershipId)) {
            return new UnauthorizedError("You don't have access to modify this company");
        }

            
            // Étape 4: Vérification de l'état
            if (!company.isActive) {
                return new CompanyValidationError("Cannot update an inactive company");
            }

            // Étape 5: Mise à jour des informations
            const updatedFields = {
                name: false,
                address: false,
                contactInfo: false
            };

            if (dto.name) {
                company.updateName(dto.name.trim());
                updatedFields.name = true;
            }

            if (this.hasAllAddressFields(dto)) {
                const newAddress = Address.create(
                    dto.street!.trim(),
                    dto.city!.trim(),
                    dto.postalCode!.trim(),
                    dto.country!.trim()
                );
                company.updateAddress(newAddress);
                updatedFields.address = true;
            }

            if (this.hasContactInfoChanges(dto)) {
                const newContactInfo = ContactInfo.create(
                    dto.phone?.trim() ?? company.contactInfo.phoneNumber,
                    dto.email ? new Email(dto.email.trim()) : company.contactInfo.emailAddress
                );
                company.updateContactInfo(newContactInfo);
                updatedFields.contactInfo = true;
            }

            // Étape 6: Sauvegarde des modifications
            await this.companyRepository.update(company);

            // Étape 7: Retour de la réponse
            return {
                success: true,
                message: `Company ${company.name} has been successfully updated`,
                companyId: company.id,
                updatedFields
            };

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while updating company information');
        }
    }

    private hasAllAddressFields(dto: UpdateCompanyInfoDTO): boolean {
        return !!(dto.street && dto.city && dto.postalCode && dto.country);
    }

    private hasContactInfoChanges(dto: UpdateCompanyInfoDTO): boolean {
        return !!(dto.phone || dto.email);
    }
}