import { PrismaClient } from '@prisma/client';
import { ICompanyMotorcycleRepository } from '@application/ports/repositories/ICompanyMotorcycleRepository';
import { CompanyMotorcycle } from '@domain/entities/CompanyMotorcycleEntity';
import { CompanyMotorcycleMapper } from '../mappers/CompanyMotorcycleMapper';

export class PrismaCompanyMotorcycleRepository implements ICompanyMotorcycleRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(companyMotorcycle: CompanyMotorcycle): Promise<void> {
        const prismaCompanyMotorcycle = CompanyMotorcycleMapper.toPrisma(companyMotorcycle);
        await this.prisma.companyMotorcycle.create({
            data: prismaCompanyMotorcycle
        });
    }

    async update(companyMotorcycle: CompanyMotorcycle): Promise<void> {
        const prismaCompanyMotorcycle = CompanyMotorcycleMapper.toPrisma(companyMotorcycle);
        await this.prisma.companyMotorcycle.update({
            where: { id: companyMotorcycle.id },
            data: prismaCompanyMotorcycle
        });
    }

    async findById(id: string): Promise<CompanyMotorcycle | null> {
        const assignment = await this.prisma.companyMotorcycle.findUnique({
            where: { id }
        });

        if (!assignment) return null;

        return CompanyMotorcycleMapper.toDomain(assignment);
    }

    async findByCompanyId(companyId: string): Promise<CompanyMotorcycle[]> {
        const assignments = await this.prisma.companyMotorcycle.findMany({
            where: { companyId }
        });

        return assignments.map(CompanyMotorcycleMapper.toDomain);
    }

    async findByMotorcycleId(motorcycleId: string): Promise<CompanyMotorcycle[]> {
        const assignments = await this.prisma.companyMotorcycle.findMany({
            where: { motorcycleId }
        });

        return assignments.map(CompanyMotorcycleMapper.toDomain);
    }

    async findActiveByCompanyId(companyId: string): Promise<CompanyMotorcycle[]> {
        const assignments = await this.prisma.companyMotorcycle.findMany({
            where: {
                companyId,
                isActive: true
            }
        });

        return assignments.map(CompanyMotorcycleMapper.toDomain);
    }

    async findActiveByMotorcycleId(motorcycleId: string): Promise<CompanyMotorcycle | null> {
        const assignment = await this.prisma.companyMotorcycle.findFirst({
            where: {
                motorcycleId,
                isActive: true
            }
        });

        if (!assignment) return null;

        return CompanyMotorcycleMapper.toDomain(assignment);
    }

    async findAll(): Promise<CompanyMotorcycle[]> {
        const assignments = await this.prisma.companyMotorcycle.findMany();
        return assignments.map(CompanyMotorcycleMapper.toDomain);
    }

    async exists(companyId: string, motorcycleId: string): Promise<boolean> {
        const count = await this.prisma.companyMotorcycle.count({
            where: {
                companyId,
                motorcycleId,
                isActive: true
            }
        });
        return count > 0;
    }
}