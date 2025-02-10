import { PrismaClient } from '@prisma/client';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { Company } from '@domain/entities/CompanyEntity';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyMapper } from '../mappers/CompanyMapper';

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(company: Company): Promise<void> {
    const prismaData = CompanyMapper.toPrismaCreate(company);
    await this.prisma.company.create({
      data: prismaData,
    });
  }

  async update(company: Company): Promise<void> {
    const prismaData = CompanyMapper.toPrismaUpdate(company);
    const employeeIds = company.employees.getAll().map((emp) => emp.id);

    await this.prisma.$transaction([
      // Déconnecter les anciens employés
      this.prisma.user.updateMany({
        where: {
          companyId: company.id,
          id: { notIn: employeeIds },
        },
        data: { companyId: null },
      }),

      // Mettre à jour l'entreprise
      this.prisma.company.update({
        where: { id: company.id },
        data: prismaData,
      }),

      // Mettre à jour les nouveaux employés
      this.prisma.user.updateMany({
        where: { id: { in: employeeIds } },
        data: { companyId: company.id },
      }),
    ]);
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        employees: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!company) return null;
    return CompanyMapper.toDomain(company);
  }

  async findByRegistrationNumber(
    registrationNumber: RegistrationNumber,
  ): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { registrationNumber: registrationNumber.toString() },
      include: {
        employees: true,
      },
    });

    if (!company) return null;
    return CompanyMapper.toDomain(company);
  }

  async findByEmployeeId(userId: string): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        employees: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        employees: true,
      },
    });

    if (!company) return null;
    return CompanyMapper.toDomain(company);
  }

  async findByDealershipId(dealershipId: string): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        createdByDealershipId: dealershipId,
      },
      include: {
        employees: true,
      },
    });

    return companies.map(CompanyMapper.toDomain);
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      include: {
        employees: true,
      },
    });
    return companies.map(CompanyMapper.toDomain);
  }

  async findActive(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: { isActive: true },
      include: {
        employees: true,
      },
    });
    return companies.map(CompanyMapper.toDomain);
  }

  async exists(registrationNumber: RegistrationNumber): Promise<boolean> {
    const count = await this.prisma.company.count({
      where: { registrationNumber: registrationNumber.toString() },
    });
    return count > 0;
  }

  async findByMotorcycleId(motorcycleId: string): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        motorcycles: {
          some: {
            id: motorcycleId,
            companyId: {
              not: null,
            },
          },
        },
      },
      include: {
        employees: true,
      },
    });

    if (!company) return null;
    return CompanyMapper.toDomain(company);
  }
}
