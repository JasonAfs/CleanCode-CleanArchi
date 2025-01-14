import { UpdateMotorcycleInfoDTO } from "@application/dtos/motorcycle/UpdateMotorcycleInfoDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class UpdateMotorcycleInfoValidator {
    public validate(dto: UpdateMotorcycleInfoDTO): void {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }

        if (dto.model !== undefined && !dto.model.trim()) {
            throw new MotorcycleValidationError("Model cannot be empty");
        }

        if (dto.year !== undefined && (dto.year < 1900)) {
            throw new MotorcycleValidationError("Invalid year");
        }

        if (dto.registrationNumber !== undefined && !dto.registrationNumber.trim()) {
            throw new MotorcycleValidationError("Registration number cannot be empty");
        }

        if (dto.mileage !== undefined && dto.mileage < 0) {
            throw new MotorcycleValidationError("Mileage cannot be negative");
        }
    }
}