import { PrismaClient } from '@prisma/client';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';
import { MotorcycleMapper } from '../mappers/MotorcycleMapper';

export class PrismaMotorcycleRepository implements IMotorcycleRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(motorcycle: Motorcycle): Promise<void> {
        const prismaMotorcycle = MotorcycleMapper.toPrisma(motorcycle);
        await this.prisma.motorcycle.create({
            data: prismaMotorcycle
        });
    }

    async update(motorcycle: Motorcycle): Promise<void> {
        const prismaMotorcycle = MotorcycleMapper.toPrisma(motorcycle);
        await this.prisma.motorcycle.update({
            where: { id: motorcycle.id },
            data: prismaMotorcycle
        });
    }

    async findById(id: string): Promise<Motorcycle | null> {
        const motorcycle = await this.prisma.motorcycle.findUnique({
            where: { id }
        });

        if (!motorcycle) return null;

        return MotorcycleMapper.toDomain(motorcycle);
    }

    async findByVin(vin: string): Promise<Motorcycle | null> {
        const motorcycle = await this.prisma.motorcycle.findUnique({
            where: { vin }
        });

        if (!motorcycle) return null;

        return MotorcycleMapper.toDomain(motorcycle);
    }

    async findByDealershipId(dealershipId: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { dealershipId }
        });

        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findByStatus(status: MotorcycleStatus): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { status }
        });

        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findAvailableByDealership(dealershipId: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: {
                dealershipId,
                status: MotorcycleStatus.AVAILABLE,
                isActive: true
            }
        });

        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async exists(vin: string): Promise<boolean> {
        const count = await this.prisma.motorcycle.count({
            where: { vin }
        });
        return count > 0;
    }

    async findAll(): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany();
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findActive(): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { isActive: true }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findDueForMaintenance(before: Date): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: {
                nextMaintenanceDate: {
                    lte: before
                },
                isActive: true
            }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }
}