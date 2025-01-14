import { UpdateCompanyInfoDTO } from "@application/dtos/company/UpdateCompanyInfoDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { Email } from "@domain/value-objects/Email";

export class UpdateCompanyInfoValidator {
    public validate(dto: UpdateCompanyInfoDTO): void {
        if (!dto.companyId?.trim()) {
            throw new CompanyValidationError("Company ID is required");
        }

        if (dto.name !== undefined && !dto.name.trim()) {
            throw new CompanyValidationError("Name cannot be empty");
        }

        // Si une partie de l'adresse est fournie, toutes les parties doivent être fournies
        const addressFields = [dto.street, dto.city, dto.postalCode, dto.country];
        const hasPartialAddress = addressFields.some(field => field !== undefined);
        const hasMissingAddress = addressFields.some(field => field === undefined || !field?.trim());
        
        if (hasPartialAddress && hasMissingAddress) {
            throw new CompanyValidationError("All address fields are required when updating address");
        }

        if (dto.email !== undefined) {
            try {
                new Email(dto.email);
            } catch (error) {
                throw new CompanyValidationError("Invalid email format");
            }
        }
    }
}