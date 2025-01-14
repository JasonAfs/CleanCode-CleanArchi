import { UnassignMotorcycleDTO } from "@application/dtos/company/UnassignMotorcycleDTO";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";

export class UnassignMotorcycleValidator {
    public validate(dto: UnassignMotorcycleDTO): void {
        if (!dto.assignmentId?.trim()) {
            throw new MotorcycleValidationError("Assignment ID is required");
        }
    }
}