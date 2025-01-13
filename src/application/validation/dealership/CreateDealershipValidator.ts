import { CreateDealershipDTO } from "@application/dtos/dealership/CreateDealershipDTO";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { Email } from "@domain/value-objects/Email";

export class CreateDealershipValidator {
    public validate(dto: CreateDealershipDTO): void {
        if (!dto.name?.trim()) {
            throw new DealershipValidationError("Name is required");
        }

        if (!dto.street?.trim()) {
            throw new DealershipValidationError("Street is required");
        }

        if (!dto.city?.trim()) {
            throw new DealershipValidationError("City is required");
        }

        if (!dto.postalCode?.trim()) {
            throw new DealershipValidationError("Postal code is required");
        }

        if (!dto.country?.trim()) {
            throw new DealershipValidationError("Country is required");
        }

        if (!dto.phone?.trim()) {
            throw new DealershipValidationError("Phone is required");
        }

        if (!dto.email?.trim()) {
            throw new DealershipValidationError("Email is required");
        }

        try {
            new Email(dto.email);
        } catch (error) {
            throw new DealershipValidationError("Invalid email format");
        }
    }
}
