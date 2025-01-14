import { CreateCompanyDTO } from "@application/dtos/company/CreateCompanyDTO";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { Email } from "@domain/value-objects/Email";

export class CreateCompanyValidator {
    public validate(dto: CreateCompanyDTO): void {
        if (!dto.name?.trim()) {
            throw new CompanyValidationError("Name is required");
        }

        if (!dto.registrationNumber?.trim()) {
            throw new CompanyValidationError("Registration number is required");
        }

        if (!dto.street?.trim()) {
            throw new CompanyValidationError("Street is required");
        }

        if (!dto.city?.trim()) {
            throw new CompanyValidationError("City is required");
        }

        if (!dto.postalCode?.trim()) {
            throw new CompanyValidationError("Postal code is required");
        }

        if (!dto.country?.trim()) {
            throw new CompanyValidationError("Country is required");
        }

        if (!dto.phone?.trim()) {
            throw new CompanyValidationError("Phone is required");
        }

        if (!dto.email?.trim()) {
            throw new CompanyValidationError("Email is required");
        }

        try {
            new Email(dto.email);
        } catch (error) {
            throw new CompanyValidationError("Invalid email format");
        }
    }
}