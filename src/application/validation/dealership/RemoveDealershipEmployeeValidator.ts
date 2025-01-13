import { RemoveDealershipEmployeeDTO } from "@application/dtos/dealership/RemoveDealershipEmployeeDTO";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";

export class RemoveDealershipEmployeeValidator {
    public validate(dto: RemoveDealershipEmployeeDTO): void {
        if (!dto.dealershipId?.trim()) {
            throw new DealershipValidationError("Dealership ID is required");
        }

        if (!dto.employeeId?.trim()) {
            throw new DealershipValidationError("Employee ID is required");
        }
    }
}