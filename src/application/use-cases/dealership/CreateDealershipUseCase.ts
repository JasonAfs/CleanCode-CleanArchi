import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { CreateDealershipDTO } from '@application/dtos/dealership/CreateDealershipDTO';
import { CreateDealershipValidator } from '@application/validation/dealership/CreateDealershipValidator';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { DealershipAlreadyExistsError } from '@domain/errors/dealership/DealershipAlreadyExistsError';

export class CreateDealershipUseCase {
  constructor(
    private readonly dealershipRepository: IDealershipRepository,
    private readonly validator: CreateDealershipValidator,
  ) {}

  public async execute(dto: CreateDealershipDTO): Promise<Dealership> {
    // Validate input
    this.validator.validate(dto);

    // Check if dealership already exists
    const exists = await this.dealershipRepository.exists(dto.name);
    if (exists) {
      throw new DealershipAlreadyExistsError(dto.name);
    }

    // Create value objects
    const address = Address.create(
      dto.street,
      dto.city,
      dto.postalCode,
      dto.country,
    );

    const contactInfo = ContactInfo.create(dto.phone, new Email(dto.email));

    // Create dealership entity
    const dealership = Dealership.create({
      name: dto.name,
      address,
      contactInfo,
    });

    // Save to repository
    await this.dealershipRepository.create(dealership);

    return dealership;
  }
}
