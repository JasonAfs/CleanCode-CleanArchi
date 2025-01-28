import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { UpdateDealershipInfoDTO } from '@application/dtos/dealership/UpdateDealershipInfoDTO';
import { UpdateDealershipInfoValidator } from '@application/validation/dealership/UpdateDealershipInfoValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { Result } from '@domain/shared/Result';
import { DealershipNotFoundError } from '@domain/errors/dealership/DealershipNotFoundError';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';

export class UpdateDealershipInfoUseCase implements IAuthorizationAware {
    private readonly validator = new UpdateDealershipInfoValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: UpdateDealershipInfoDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.UPDATE_DEALERSHIP_INFO)
    public async execute(dto: UpdateDealershipInfoDTO): Promise<Result<void, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Récupérer la concession
            const dealership = await this.dealershipRepository.findById(dto.dealershipId);
            if (!dealership) {
                return new DealershipNotFoundError(dto.dealershipId);
            }

            // Vérifier les droits d'accès pour les managers de concession
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && !dealership.hasEmployee(dto.userId)) {
                return new UnauthorizedError("You don't have access to this dealership");
            }

            // Mettre à jour les informations
            if (dto.name) {
                dealership.updateName(dto.name.trim());
            }

            // Mise à jour de l'adresse si tous les champs sont fournis
            if (dto.street && dto.city && dto.postalCode && dto.country) {
                const newAddress = Address.create(
                    dto.street.trim(),
                    dto.city.trim(),
                    dto.postalCode.trim(),
                    dto.country.trim()
                );
                dealership.updateAddress(newAddress);
            }

            // Mise à jour des informations de contact
            if (dto.phone || dto.email) {
                const newContactInfo = ContactInfo.create(
                    dto.phone?.trim() ?? dealership.contactInfo.phoneNumber,
                    dto.email ? new Email(dto.email.trim()) : dealership.contactInfo.emailAddress
                );
                dealership.updateContactInfo(newContactInfo);
            }

            // Sauvegarder les modifications
            await this.dealershipRepository.update(dealership);

            return;
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while updating dealership information');
        }
    }
}