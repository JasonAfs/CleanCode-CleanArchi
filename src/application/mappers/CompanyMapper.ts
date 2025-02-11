import { Company } from '@domain/entities/CompanyEntity';
import { CompanyResponseDTO } from '../dtos/company/response/CompanyResponseDTO';

export class CompanyMapper {
  public static toDTO(company: Company): CompanyResponseDTO {
    return {
      id: company.id,
      name: company.name,
      address: {
        street: company.address.street,
        city: company.address.city,
        postalCode: company.address.postalCode,
        country: company.address.country,
      },
      contactInfo: {
        phoneNumber: company.contactInfo.phoneNumber,
        email: company.contactInfo.emailAddress.toString(),
      },
      registrationNumber: company.registrationNumber.toString(),
      isActive: company.isActive,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      dealershipId: company.createdByDealershipId,
    };
  }
}
