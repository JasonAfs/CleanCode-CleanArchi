import { Company as PrismaCompany, User as PrismaUser } from '@prisma/client';
import { Company } from '@domain/entities/CompanyEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyEmployees } from '@domain/aggregates/company/CompanyEmployees';
import { UserMapper } from './UserMapper';

export class CompanyMapper {
  /**
   * Convertit une entité Prisma en entité de domaine
   */
  public static toDomain(
    prismaCompany: PrismaCompany & {
      employees?: PrismaUser[];
    },
  ): Company {
    // Reconstituer l'agrégat des employés
    let employees = CompanyEmployees.create();
    if (prismaCompany.employees?.length) {
      for (const employee of prismaCompany.employees) {
        const userEntity = UserMapper.toDomain(employee);
        employees = employees.addEmployee(userEntity);
      }
    }

    // Utiliser la méthode reconstitute pour créer l'entité
    const company = Company.reconstitute(
      {
        id: prismaCompany.id,
        name: prismaCompany.name,
        registrationNumber: RegistrationNumber.create(
          prismaCompany.registrationNumber,
        ),
        address: Address.create(
          prismaCompany.street,
          prismaCompany.city,
          prismaCompany.postalCode,
          prismaCompany.country,
        ),
        contactInfo: ContactInfo.create(
          prismaCompany.phone,
          new Email(prismaCompany.email),
        ),
        isActive: prismaCompany.isActive,
        createdAt: prismaCompany.createdAt,
        updatedAt: prismaCompany.updatedAt,
        createdByDealershipId: prismaCompany.createdByDealershipId || undefined,
      },
      employees,
    );

    return company;
  }

  /**
   * Convertit une entité de domaine en objet Prisma pour la création
   */
  public static toPrismaCreate(company: Company): any {
    return {
      id: company.id,
      name: company.name,
      registrationNumber: company.registrationNumber.toString(),
      street: company.address.street,
      city: company.address.city,
      postalCode: company.address.postalCode,
      country: company.address.country,
      phone: company.contactInfo.phoneNumber,
      email: company.contactInfo.emailAddress.toString(),
      isActive: company.isActive,
      createdByDealershipId: company.createdByDealershipId || null,
      // Pas de relations lors de la création initiale
    };
  }

  /**
   * Convertit une entité de domaine en objet Prisma pour la mise à jour
   */
  public static toPrismaUpdate(company: Company): any {
    return {
      name: company.name,
      street: company.address.street,
      city: company.address.city,
      postalCode: company.address.postalCode,
      country: company.address.country,
      phone: company.contactInfo.phoneNumber,
      email: company.contactInfo.emailAddress.toString(),
      isActive: company.isActive,
      // Gestion des relations pour la mise à jour
      employees: {
        connect: company.employees.getAll().map((employee) => ({
          id: employee.id,
        })),
      },
    };
  }
}
