import { UpdateMotorcycleStatusDTO } from "@application/dtos/motorcycle/UpdateMotorcycleStatusDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";
import { MotorcycleStatus } from "@domain/enums/MotorcycleStatus";

export class UpdateMotorcycleStatusValidator {
    public validate(dto: UpdateMotorcycleStatusDTO): void {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }

        if (!Object.values(MotorcycleStatus).includes(dto.status)) {
            throw new MotorcycleValidationError("Invalid motorcycle status");
        }
    }
}
