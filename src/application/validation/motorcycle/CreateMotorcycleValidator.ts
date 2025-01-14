import { CreateMotorcycleDTO } from "@application/dtos/motorcycle/CreateMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class CreateMotorcycleValidator {
    public validate(dto: CreateMotorcycleDTO): void {
        if (!dto.vin?.trim()) {
            throw new MotorcycleValidationError("VIN is required");
        }

        if (!dto.dealershipId?.trim()) {
            throw new MotorcycleValidationError("Dealership ID is required");
        }

        if (!dto.model?.trim()) {
            throw new MotorcycleValidationError("Model is required");
        }

        if (!dto.registrationNumber?.trim()) {
            throw new MotorcycleValidationError("Registration number is required");
        }

        if (!dto.year || dto.year < 1900) {
            throw new MotorcycleValidationError("Invalid year");
        }

        if (dto.mileage < 0) {
            throw new MotorcycleValidationError("Mileage cannot be negative");
        }
    }
}