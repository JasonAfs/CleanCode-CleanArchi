import { PrismaClient } from '@prisma/client';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { Dealership } from '@domain/entities/DealershipEntity';
import { DealershipMapper } from '../mappers/DealershipMapper';

export class PrismaDealershipRepository implements IDealershipRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(dealership: Dealership): Promise<void> {
        const prismaDealership = DealershipMapper.toPrisma(dealership);
        await this.prisma.dealership.create({
            data: prismaDealership
        });
    }

    async update(dealership: Dealership): Promise<void> {
        const prismaDealership = DealershipMapper.toPrisma(dealership);
        await this.prisma.dealership.update({
            where: { id: dealership.id },
            data: prismaDealership
        });
    }

    async findById(id: string): Promise<Dealership | null> {
        const dealership = await this.prisma.dealership.findUnique({
            where: { id },
            include: {
                employees: true // Pour charger les employés associés
            }
        });

        if (!dealership) return null;
        return DealershipMapper.toDomain(dealership);
    }

    async findByName(name: string): Promise<Dealership | null> {
        const dealership = await this.prisma.dealership.findUnique({
            where: { name },
            include: {
                employees: true
            }
        });

        if (!dealership) return null;
        return DealershipMapper.toDomain(dealership);
    }

    async findByEmployee(userId: string): Promise<Dealership | null> {
        const dealership = await this.prisma.dealership.findFirst({
            where: {
                employees: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                employees: true
            }
        });

        if (!dealership) return null;
        return DealershipMapper.toDomain(dealership);
    }

    async findAll(): Promise<Dealership[]> {
        const dealerships = await this.prisma.dealership.findMany({
            include: {
                employees: true,
                motorcycles: true 
            }
        });
        return dealerships.map(DealershipMapper.toDomain);
    }

    async findActive(): Promise<Dealership[]> {
        const dealerships = await this.prisma.dealership.findMany({
            where: { isActive: true },
            include: {
                employees: true,
                motorcycles: true  
            }
        });
        return dealerships.map(DealershipMapper.toDomain);
    }

    async exists(name: string): Promise<boolean> {
        const count = await this.prisma.dealership.count({
            where: { name }
        });
        return count > 0;
    }
}