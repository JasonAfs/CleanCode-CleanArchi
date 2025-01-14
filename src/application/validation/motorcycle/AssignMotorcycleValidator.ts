import { AssignMotorcycleDTO } from "@application/dtos/company/AssignMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class AssignMotorcycleValidator {
    public validate(dto: AssignMotorcycleDTO): void {
        if (!dto.motorcycleId?.trim()) {
            throw new MotorcycleValidationError("Motorcycle ID is required");
        }

        if (!dto.companyId?.trim()) {
            throw new MotorcycleValidationError("Company ID is required");
        }
    }
}