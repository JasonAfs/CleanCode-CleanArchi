import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { RemoveDealershipEmployeeDTO } from "@application/dtos/dealership/RemoveDealershipEmployeeDTO";
import { RemoveDealershipEmployeeValidator } from "@application/validation/dealership/RemoveDealershipEmployeeValidator";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";

export class RemoveDealershipEmployeeUseCase {
    constructor(
        private readonly dealershipRepository: IDealershipRepository,
        private readonly validator: RemoveDealershipEmployeeValidator
    ) {}

    public async execute(dto: RemoveDealershipEmployeeDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get dealership
        const dealership = await this.dealershipRepository.findById(dto.dealershipId);
        if (!dealership) {
            throw new DealershipNotFoundError(dto.dealershipId);
        }

        // Check if employee exists in dealership
        if (!dealership.hasEmployee(dto.employeeId)) {
            throw new DealershipValidationError("Employee not found in this dealership");
        }

        // Remove employee
        dealership.removeEmployee(dto.employeeId);

        // Save changes
        await this.dealershipRepository.update(dealership);
    }
}