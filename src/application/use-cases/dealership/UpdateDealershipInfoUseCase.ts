import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { UpdateDealershipInfoDTO } from '@application/dtos/dealership/request/UpdateDealershipInfoDTO';
import { UpdateDealershipInfoValidator } from '@application/validation/dealership/UpdateDealershipInfoValidator';
import { Authorize} from '@application/decorators/Authorize';
import { IAuthorizationAware } from '@domain/services/authorization/IAuthorizationAware';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { UpdateDealershipInfoResponseDTO } from '@application/dtos/dealership/response/UpdateDealershipInfoResponseDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class UpdateDealershipInfoUseCase implements IAuthorizationAware {
    private readonly validator = new UpdateDealershipInfoValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository,
    ) {
    }

    public getAuthorizationContext(dto: UpdateDealershipInfoDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.MANAGE_DEALERSHIP)
    public async execute(dto: UpdateDealershipInfoDTO): Promise<Result<UpdateDealershipInfoResponseDTO, Error>> {
        try {
            // Étape 1: Validation des données d'entrée
            try {
                this.validator.validate(dto);
            } catch (error) {
                if (error instanceof DealershipValidationError) {
                    return error;
                }
                throw error;
            }

            // Étape 2: Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }


            // Étape 4: Mise à jour des informations
            if (dto.name) {
                dealership.updateName(dto.name.trim());
            }

            // Étape 5: Mise à jour de l'adresse si tous les champs sont fournis
            if (this.hasAllAddressFields(dto)) {
                const newAddress = Address.create(
                    dto.street!.trim(),
                    dto.city!.trim(),
                    dto.postalCode!.trim(),
                    dto.country!.trim()
                );
                dealership.updateAddress(newAddress);
            }

            // Étape 6: Mise à jour des informations de contact
            if (this.hasContactInfoChanges(dto)) {
                const newContactInfo = ContactInfo.create(
                    dto.phone?.trim() ?? dealership.contactInfo.phoneNumber,
                    dto.email ? new Email(dto.email.trim()) : dealership.contactInfo.emailAddress
                );
                dealership.updateContactInfo(newContactInfo);
            }

            const updatedFields = {
                name: !!dto.name,
                address: this.hasAllAddressFields(dto),
                contactInfo: this.hasContactInfoChanges(dto)
            };

            // Étape 7: Sauvegarder les modifications
            await this.dealershipRepository.update(dealership);

            return {
                success: true,
                message: `Dealership ${dealership.name} has been successfully updated`,
                dealershipId: dealership.id,
                updatedFields
            };
            
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while updating dealership information');
        }
    }

    private hasAllAddressFields(dto: UpdateDealershipInfoDTO): boolean {
        return !!(dto.street && dto.city && dto.postalCode && dto.country);
    }

    private hasContactInfoChanges(dto: UpdateDealershipInfoDTO): boolean {
        return !!(dto.phone || dto.email);
    }
}