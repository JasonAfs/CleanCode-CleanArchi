import { GetCompaniesDTO } from "@application/dtos/company/request/GetCompaniesDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";

export class GetCompaniesValidator {
    public validate(dto: GetCompaniesDTO): void {
        if (!dto.userId?.trim()) {
            throw new CompanyValidationError('User ID is required');
        }
        if (!dto.userRole) {
            throw new CompanyValidationError('User role is required');
        }
    }
}