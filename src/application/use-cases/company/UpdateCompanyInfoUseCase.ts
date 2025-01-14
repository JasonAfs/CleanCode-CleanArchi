import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { UpdateCompanyInfoDTO } from "@application/dtos/company/UpdateCompanyInfoDTO";
import { UpdateCompanyInfoValidator } from "@application/validation/company/UpdateCompanyInfoValidator";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { Email } from "@domain/value-objects/Email";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";

export class UpdateCompanyInfoUseCase {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly validator: UpdateCompanyInfoValidator
    ) {}

    public async execute(dto: UpdateCompanyInfoDTO): Promise<void> {
        // Validate input
        this.validator.validate(dto);

        // Get company
        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        // Verify company is active
        if (!company.isActive) {
            throw new CompanyValidationError("Cannot update an inactive company");
        }

        // Update name if provided
        if (dto.name) {
            company.updateName(dto.name);
        }

        // Update address if all fields are provided
        if (dto.street && dto.city && dto.postalCode && dto.country) {
            const newAddress = Address.create(
                dto.street,
                dto.city,
                dto.postalCode,
                dto.country
            );
            company.updateAddress(newAddress);
        }

        // Update contact info if either phone or email is provided
        if (dto.phone || dto.email) {
            const newContactInfo = ContactInfo.create(
                dto.phone || company.contactInfo.phoneNumber,
                dto.email ? new Email(dto.email) : company.contactInfo.emailAddress
            );
            company.updateContactInfo(newContactInfo);
        }

        // Save changes
        await this.companyRepository.update(company);
    }
}