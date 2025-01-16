import { ICompanyRepository } from "@application/ports/repositories/ICompanyRepository";
import { CreateCompanyDTO } from "@application/dtos/company/CreateCompanyDTO";
import { CreateCompanyValidator } from "@application/validation/company/CreateCompanyValidator";
import { Authorize, IAuthorizationAware } from "@application/decorators/Authorize";
import { AuthorizationContext } from "@domain/services/authorization/AuthorizationContext";
import { Company } from "@domain/entities/CompanyEntity";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { Email } from "@domain/value-objects/Email";
import { RegistrationNumber } from "@domain/value-objects/RegistrationNumber";
import { Permission } from "@domain/services/authorization/Permission";

export class CreateCompanyUseCase implements IAuthorizationAware {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly validator: CreateCompanyValidator
    ) {}

    public getAuthorizationContext(dto: CreateCompanyDTO): AuthorizationContext {
        console.log('Authorization Context:', {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        });
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }
    
    @Authorize(Permission.CREATE_PARTNER_COMPANY)
    public async execute(dto: CreateCompanyDTO): Promise<Company> {
        // Validate input
        this.validator.validate(dto);

        const registrationNumber = RegistrationNumber.create(dto.registrationNumber);

        // Check if company already exists
        const exists = await this.companyRepository.exists(registrationNumber);
        if (exists) {
            throw new Error(`Company with registration number ${dto.registrationNumber} already exists`);
        }

        // Create value objects
        const address = Address.create(
            dto.street,
            dto.city,
            dto.postalCode,
            dto.country
        );

        const contactInfo = ContactInfo.create(
            dto.phone,
            new Email(dto.email)
        );

        // Create company entity
        const company = Company.create({
            name: dto.name.trim(),
            registrationNumber,
            address,
            contactInfo
        });

        // Save to repository
        await this.companyRepository.create(company);

        return company;
    }
}