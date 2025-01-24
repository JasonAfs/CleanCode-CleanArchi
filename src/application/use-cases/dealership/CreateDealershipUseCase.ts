import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { CreateDealershipDTO } from '@application/dtos/dealership/CreateDealershipDTO';
import { CreateDealershipValidator } from '@application/validation/dealership/CreateDealershipValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { Permission } from '@domain/services/authorization/Permission';
import { DealershipAlreadyExistsError } from '@domain/errors/dealership/DealershipAlreadyExistsError';
import { Result } from '@domain/shared/Result';

export class CreateDealershipUseCase implements IAuthorizationAware {
    constructor(
        private readonly dealershipRepository: IDealershipRepository,
    ) {}
    
    private readonly validator = new CreateDealershipValidator();

    public getAuthorizationContext(dto: CreateDealershipDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole
        };
    }
    
    @Authorize(Permission.MANAGE_ALL_DEALERSHIPS)
    public async execute(dto: CreateDealershipDTO): Promise<Result<Dealership, Error>> {
        // Validation des données
        this.validator.validate(dto);

        // Vérification si la concession existe déjà
        const exists = await this.dealershipRepository.exists(dto.name);
        if (exists) {
            return new DealershipAlreadyExistsError(dto.name);
        }

        // Création des value objects
        const address = Address.create(
            dto.street,
            dto.city,
            dto.postalCode,
            dto.country
        );

        const contactInfo = ContactInfo.create(
            dto.phone,
            new Email(dto.email)
        );

        // Création de l'entité Dealership
        const dealership = Dealership.create({
            name: dto.name.trim(),
            address,
            contactInfo
        });

        // Sauvegarde
        await this.dealershipRepository.create(dealership);

        return dealership;
    }
}