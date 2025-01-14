import { TransferMotorcycleDTO } from "@application/dtos/motorcycle/TransferMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class TransferMotorcycleValidator {
    public validate(dto: TransferMotorcycleDTO): void {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }
        if (!dto.newDealershipId?.trim()) {
            throw new MotorcycleValidationError("New dealership ID is required");
        }
    }
}
