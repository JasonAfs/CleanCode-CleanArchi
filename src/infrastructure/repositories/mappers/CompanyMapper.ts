import { Company as PrismaCompany } from '@prisma/client';
import { Company } from '@domain/entities/CompanyEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyEmployees } from '@domain/aggregates/company/CompanyEmployees';

export class CompanyMapper {
    public static toDomain(prismaCompany: PrismaCompany): Company {
        const company = Company.create({
            name: prismaCompany.name,
            registrationNumber: RegistrationNumber.create(prismaCompany.registrationNumber),
            address: Address.create(
                prismaCompany.street,
                prismaCompany.city,
                prismaCompany.postalCode,
                prismaCompany.country
            ),
            contactInfo: ContactInfo.create(
                prismaCompany.phone,
                new Email(prismaCompany.email)
            ),
            createdByDealershipId: prismaCompany.createdByDealershipId || undefined
        });

        // Définir les propriétés qui ne peuvent pas être modifiées après la création
        Object.defineProperty(company, 'id', { value: prismaCompany.id });
        Object.defineProperty(company, 'isActive', { value: prismaCompany.isActive });
        Object.defineProperty(company, 'createdAt', { value: prismaCompany.createdAt });
        Object.defineProperty(company, 'updatedAt', { value: prismaCompany.updatedAt });

        return company;
    }

    public static toPrisma(company: Company): Omit<PrismaCompany, 'createdAt' | 'updatedAt'> {
        return {
            id: company.id,
            name: company.name,
            registrationNumber: company.registrationNumber.toString(),
            street: company.address.toString().split(',')[0].trim(),
            city: company.address.toString().split(',')[1].trim(),
            postalCode: company.address.toString().split(',')[2].trim(),
            country: company.address.toString().split(',')[3].trim(),
            phone: company.contactInfo.phoneNumber,
            email: company.contactInfo.emailAddress.toString(),
            isActive: company.isActive,
            createdByDealershipId: company.createdByDealershipId || null
        };
    }
}