import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { UnassignMotorcycleDTO } from "@application/dtos/company/UnassignMotorcycleDTO";
import { UnassignMotorcycleValidator } from "@application/validation/motorcycle/UnassignMotorcycleValidator";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";

export class UnassignMotorcycleFromCompanyUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: UnassignMotorcycleValidator
    ) {}

    public async execute(dto: UnassignMotorcycleDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get assignment
        const assignment = await this.companyMotorcycleRepository.findById(dto.assignmentId);
        if (!assignment) {
            throw new CompanyValidationError("Assignment not found");
        }

        if (!assignment.isActive) {
            throw new CompanyValidationError("Assignment is already inactive");
        }

        // Get motorcycle
        const motorcycle = await this.motorcycleRepository.findById(assignment.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(assignment.motorcycleId);
        }

        // End assignment
        assignment.endAssignment(motorcycle);

        // Save changes
        await this.motorcycleRepository.update(motorcycle);
        await this.companyMotorcycleRepository.update(assignment);
    }
}