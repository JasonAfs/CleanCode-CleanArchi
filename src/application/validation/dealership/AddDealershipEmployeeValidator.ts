// src/application/validation/dealership/AddEmployeeValidator.ts
import { AddDealershipEmployeeDTO } from "@application/dtos/dealership/AddDealershipEmployeeDTO";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { UserRole } from "@domain/enums/UserRole";

export class AddDealershipEmployeeValidator {
    private readonly allowedRoles = [
        UserRole.DEALER_EMPLOYEE,
        UserRole.TECHNICIAN,
        UserRole.STOCK_MANAGER
    ];

    public validate(dto: AddDealershipEmployeeDTO): void {
        if (!dto.dealershipId?.trim()) {
            throw new DealershipValidationError("Dealership ID is required");
        }

        if (!dto.employeeId?.trim()) {
            throw new DealershipValidationError("Employee ID is required");
        }

        if (!dto.role) {
            throw new DealershipValidationError("Role is required");
        }

        if (!this.allowedRoles.includes(dto.role)) {
            throw new DealershipValidationError(
                `Invalid role for dealership employee. Allowed roles are: ${this.allowedRoles.join(', ')}`
            );
        }
    }
}