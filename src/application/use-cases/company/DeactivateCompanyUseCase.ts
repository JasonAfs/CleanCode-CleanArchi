import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { ICompanyMotorcycleRepository } from "@application/ports/repositories/ICompanyMotorcycleRepository";
import { DeactivateCompanyDTO } from "@application/dtos/company/DeactivateCompanyDTO";
import { DeactivateCompanyValidator } from "@application/validation/company/DeactivateCompanyValidator";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";

export class DeactivateCompanyUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly companyMotorcycleRepository: ICompanyMotorcycleRepository,
        private readonly validator: DeactivateCompanyValidator
    ) {}

    public async execute(dto: DeactivateCompanyDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get company
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        if (!company.isActive) {
            throw new CompanyValidationError("Company is already inactive");
        }

        // Check if company has active motorcycle assignments
        const activeAssignments = await this.companyMotorcycleRepository.findActiveByCompanyId(dto.companyId);
        if (activeAssignments.length > 0) {
            throw new CompanyValidationError("Cannot deactivate company with active motorcycle assignments");
        }

        // Deactivate company
        company.deactivate();

        // Save changes
        await this.companyRepository.update(company);
    }
}