import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { DeactivateMotorcycleDTO } from "@application/dtos/motorcycle/DeactivateMotorcycleDTO";
import { DeactivateMotorcycleValidator } from "@application/validation/motorcycle/DeactivateMotorcycleValidator";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class DeactivateMotorcycleUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: DeactivateMotorcycleValidator
    ) {}

    public async execute(dto: DeactivateMotorcycleDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        if (!motorcycle.isActive) {
            throw new MotorcycleValidationError("Motorcycle is already inactive");
        }

        // Check if motorcycle has active assignments
        const activeAssignment = await this.companyMotorcycleRepository.findActiveByMotorcycleId(dto.motorcycleId);
        if (activeAssignment) {
            throw new MotorcycleValidationError("Cannot deactivate motorcycle with active company assignment");
        }

        // Deactivate motorcycle
        motorcycle.deactivate();

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
    }
}
