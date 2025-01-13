import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { DeactivateDealershipDTO } from "@application/dtos/dealership/DeactivateDealershipDTO";
import { DeactivateDealershipValidator } from "@application/validation/dealership/DeactivateDealershipValidator";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";

export class DeactivateDealershipUseCase {
    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly validator: DeactivateDealershipValidator
    ) {}

    public async execute(dto: DeactivateDealershipDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get dealership
        const dealership = await this.dealershipRepository.findById(dto.dealershipId);
        if (!dealership) {
            throw new DealershipNotFoundError(dto.dealershipId);
        }

        // Deactivate dealership
        dealership.deactivate();

        // Save changes
        await this.dealershipRepository.update(dealership);
    }
}