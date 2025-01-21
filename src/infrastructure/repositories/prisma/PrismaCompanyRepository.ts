import { PrismaClient } from '@prisma/client';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { Company } from '@domain/entities/CompanyEntity';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyMapper } from '../mappers/CompanyMapper';

export class PrismaCompanyRepository implements ICompanyRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(company: Company): Promise<void> {
        const prismaCompany = CompanyMapper.toPrisma(company);
        await this.prisma.company.create({
            data: prismaCompany
        });
    }

    async update(company: Company): Promise<void> {
        const prismaCompany = CompanyMapper.toPrisma(company);
        await this.prisma.company.update({
            where: { id: company.id },
            data: prismaCompany
        });
    }

    async findById(id: string): Promise<Company | null> {
        const company = await this.prisma.company.findUnique({
            where: { id }
        });
        
        if (!company) return null;
        return CompanyMapper.toDomain(company);
    }

    async findByRegistrationNumber(registrationNumber: RegistrationNumber): Promise<Company | null> {
        const company = await this.prisma.company.findUnique({
            where: { registrationNumber: registrationNumber.toString() }
        });

        if (!company) return null;
        return CompanyMapper.toDomain(company);
    }

    async findByEmployeeId(userId: string): Promise<Company | null> {
        const company = await this.prisma.company.findFirst({
            where: {
                employees: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        if (!company) return null;
        return CompanyMapper.toDomain(company);
    }

    async findByDealershipId(dealershipId: string): Promise<Company[]> {
        const companies = await this.prisma.company.findMany({
            where: {
                createdByDealershipId: dealershipId
            }
        });

        return companies.map(CompanyMapper.toDomain);
    }

    async findAll(): Promise<Company[]> {
        const companies = await this.prisma.company.findMany();
        return companies.map(CompanyMapper.toDomain);
    }

    async findActive(): Promise<Company[]> {
        const companies = await this.prisma.company.findMany({
            where: { isActive: true }
        });
        return companies.map(CompanyMapper.toDomain);
    }

    async exists(registrationNumber: RegistrationNumber): Promise<boolean> {
        const count = await this.prisma.company.count({
            where: { registrationNumber: registrationNumber.toString() }
        });
        return count > 0;
    }
}