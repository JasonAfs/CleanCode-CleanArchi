import { DeactivateCompanyDTO } from "@application/dtos/company/DeactivateCompanyDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";

export class DeactivateCompanyValidator {
    public validate(dto: DeactivateCompanyDTO): void {
        if (!dto.companyId?.trim()) {
            throw new CompanyValidationError("Company ID is required");
        }
    }
}