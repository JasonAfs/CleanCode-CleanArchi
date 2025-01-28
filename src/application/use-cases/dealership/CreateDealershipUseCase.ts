import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { CreateDealershipDTO } from '@application/dtos/dealership/CreateDealershipDTO';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { Permission } from '@domain/services/authorization/Permission';
import { DealershipAlreadyExistsError } from '@domain/errors/dealership/DealershipAlreadyExistsError';
import { Result } from '@domain/shared/Result';
import { CreateDealershipValidator } from '@application/validation/dealership/CreateDealershipValidator';

export class CreateDealershipUseCase implements IAuthorizationAware {
    private readonly validator = new CreateDealershipValidator();

    constructor(
        private readonly dealershipRepository: IDealershipRepository
    ) {}

    public getAuthorizationContext(dto: CreateDealershipDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole
        };
    }
    
    @Authorize(Permission.MANAGE_ALL_DEALERSHIPS)
    public async execute(dto: CreateDealershipDTO): Promise<Result<Dealership, Error>> {
        try {
            // Validation des données d'entrée
            this.validator.validate(dto);

            // Vérifier si la concession existe déjà
            const exists = await this.dealershipRepository.exists(dto.name);
            if (exists) {
                return new DealershipAlreadyExistsError(dto.name);
            }

            // Création des value objects
            const address = Address.create(
                dto.street.trim(),
                dto.city.trim(),
                dto.postalCode.trim(),
                dto.country.trim()
            );

            const contactInfo = ContactInfo.create(
                dto.phone.trim(),
                new Email(dto.email.trim())
            );

            // Création de l'entité Dealership
            const dealership = Dealership.create({
                name: dto.name.trim(),
                address,
                contactInfo
            });

            // Sauvegarde dans le repository
            await this.dealershipRepository.create(dealership);

            return dealership;
        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while creating the dealership');
        }
    }
}
