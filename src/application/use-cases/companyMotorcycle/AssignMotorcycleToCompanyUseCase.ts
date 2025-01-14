import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { AssignMotorcycleDTO } from "@application/dtos/company/AssignMotorcycleDTO";
import { AssignMotorcycleValidator } from "@application/validation/motorcycle/AssignMotorcycleValidator";
import { CompanyMotorcycle } from "@domain/entities/CompanyMotorcycleEntity";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { MotorcycleNotFoundError } from "@domain/errors/motorcycle/MotorcycleNotFoundError";

export class AssignMotorcycleToCompanyUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly motorcycleRepository: IMotorcycleRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: AssignMotorcycleValidator
    ) {}

    public async execute(dto: AssignMotorcycleDTO): Promise<CompanyMotorcycle> {
        // Validate input
        this.validator.validate(dto);

        // Check if company exists and is active
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        if (!company.isActive) {
            throw new CompanyValidationError(`Company ${dto.companyId} is not active`);
        }

        // Check if motorcycle exists and is available
        const motorcycle = await this.motorcycleRepository.findById(dto.motorcycleId);
        if (!motorcycle) {
            throw new MotorcycleNotFoundError(dto.motorcycleId);
        }

        // Check if motorcycle is not already assigned to another company
        const existingAssignment = await this.companyMotorcycleRepository.findActiveByMotorcycleId(dto.motorcycleId);
        if (existingAssignment) {
            throw new CompanyValidationError(`Motorcycle ${dto.motorcycleId} is already assigned to a company`);
        }

        // Create assignment
        const assignment = CompanyMotorcycle.assign(company.id, motorcycle);

        // Save to repository
        await this.companyMotorcycleRepository.create(assignment);
        await this.motorcycleRepository.update(motorcycle);

        return assignment;
    }
}