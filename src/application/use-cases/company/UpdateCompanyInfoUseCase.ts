import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { UpdateCompanyInfoDTO } from '@application/dtos/company/UpdateCompanyInfoDTO';
import { UpdateCompanyInfoValidator } from '@application/validation/company/UpdateCompanyInfoValidator';
import { Authorize, IAuthorizationAware } from '@application/decorators/Authorize';
import { AuthorizationContext } from '@domain/services/authorization/AuthorizationContext';
import { Permission } from '@domain/services/authorization/Permission';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';

export class UpdateCompanyInfoUseCase implements IAuthorizationAware {
    constructor(
        private readonly companyRepository: ICompanyRepository,
    ) {}

    private readonly validator = new UpdateCompanyInfoValidator();

    public getAuthorizationContext(dto: UpdateCompanyInfoDTO): AuthorizationContext {
        return {
            userId: dto.userId,
            userRole: dto.userRole,
            dealershipId: dto.dealershipId
        };
    }

    @Authorize(Permission.UPDATE_PARTNER_COMPANY)
    public async execute(dto: UpdateCompanyInfoDTO): Promise<void> {
        this.validator.validate(dto);

        const company = await this.companyRepository.findById(dto.companyId);
        if (!company) {
            throw new CompanyValidationError(`Company not found with id: ${dto.companyId}`);
        }

        if (dto.userRole !== UserRole.TRIUMPH_ADMIN && 
            !company.belongsToDealership(dto.dealershipId)) {
            throw new UnauthorizedError("You don't have access to this company");
        }

        if (!company.isActive) {
            throw new CompanyValidationError("Cannot update an inactive company");
        }

        if (dto.name) {
            company.updateName(dto.name);
        }

        if (dto.street && dto.city && dto.postalCode && dto.country) {
            const newAddress = Address.create(
                dto.street,
                dto.city,
                dto.postalCode,
                dto.country
            );
            company.updateAddress(newAddress);
        }

        if (dto.phone || dto.email) {
            const newContactInfo = ContactInfo.create(
                dto.phone ?? company.contactInfo.phoneNumber,
                dto.email ? new Email(dto.email) : company.contactInfo.emailAddress
            );
            company.updateContactInfo(newContactInfo);
        }

        await this.companyRepository.update(company);
    }
}
