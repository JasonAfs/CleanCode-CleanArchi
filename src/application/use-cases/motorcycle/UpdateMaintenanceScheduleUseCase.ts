import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { UpdateMaintenanceScheduleDTO } from "@application/dtos/motorcycle/UpdateMaintenanceScheduleDTO";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class UpdateMaintenanceScheduleUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository
    ) {}

    public async execute(dto: UpdateMaintenanceScheduleDTO): Promise<void> {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }

        if (!dto.nextMaintenanceDate) {
            throw new MotorcycleValidationError("Next maintenance date is required");
        }

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        // Schedule next maintenance
        motorcycle.scheduleNextMaintenance(dto.nextMaintenanceDate);

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
    }
}