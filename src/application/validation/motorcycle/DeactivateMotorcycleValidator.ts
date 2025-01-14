import { DeactivateMotorcycleDTO } from "@application/dtos/motorcycle/DeactivateMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class DeactivateMotorcycleValidator {
    public validate(dto: DeactivateMotorcycleDTO): void {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }
    }
}