import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { UpdateMotorcycleStatusDTO } from "@application/dtos/motorcycle/UpdateMotorcycleStatusDTO";
import { UpdateMotorcycleStatusValidator } from "@application/validation/motorcycle/UpdateMotorcycleStatusValidator";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";
import { MotorcycleStatus } from "@domain/enums/MotorcycleStatus";

export class UpdateMotorcycleStatusUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: UpdateMotorcycleStatusValidator
    ) {}

    public async execute(dto: UpdateMotorcycleStatusDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        // If setting to AVAILABLE, check no active assignments
        if (dto.status === MotorcycleStatus.AVAILABLE) {
            const activeAssignment = await this.companyMotorcycleRepository.findActiveByMotorcycleId(dto.motorcycleId);
            if (activeAssignment) {
                throw new Error("Cannot set status to AVAILABLE while motorcycle is assigned to a company");
            }
        }

        // Update status based on the requested status
        switch (dto.status) {
            case MotorcycleStatus.AVAILABLE:
                motorcycle.markAsAvailable();
                break;
            case MotorcycleStatus.IN_USE:
                motorcycle.markAsInUse();
                break;
            case MotorcycleStatus.MAINTENANCE:
                motorcycle.markAsInMaintenance();
                break;
            case MotorcycleStatus.OUT_OF_SERVICE:
                motorcycle.markAsOutOfService();
                break;
        }

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
    }
}