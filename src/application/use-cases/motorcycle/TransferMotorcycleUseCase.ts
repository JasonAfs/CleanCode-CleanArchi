import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { TransferMotorcycleDTO } from "@application/dtos/motorcycle/TransferMotorcycleDTO";
import { TransferMotorcycleValidator } from "@application/validation/motorcycle/TransferMotorcycleValidator";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class TransferMotorcycleUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly dealershipRepository: IDealershipRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: TransferMotorcycleValidator
    ) {}

    public async execute(dto: TransferMotorcycleDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        if (!motorcycle.isActive) {
            throw new MotorcycleValidationError("Cannot transfer inactive motorcycle");
        }

        // Check if new dealership exists
        const newDealership = await this.dealershipRepository.findById(dto.newDealershipId);
        if (!newDealership) {
            throw new DealershipNotFoundError(dto.newDealershipId);
        }

        if (!newDealership.isActive) {
            throw new MotorcycleValidationError("Cannot transfer to inactive dealership");
        }

        // Check if motorcycle has active assignments
        const activeAssignment = await this.companyMotorcycleRepository.findActiveByMotorcycleId(dto.motorcycleId);
        if (activeAssignment) {
            throw new MotorcycleValidationError("Cannot transfer motorcycle with active company assignment");
        }

        // Update motorcycle's dealership
        motorcycle.transferToDealership(dto.newDealershipId);

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
    }
}