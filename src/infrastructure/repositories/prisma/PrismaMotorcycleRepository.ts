import { PrismaClient,Prisma } from '@prisma/client';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { VIN } from '@domain/value-objects/VIN';
import { Model } from '@domain/value-objects/Model';
import { MotorcycleMapper } from '../mappers/MotorcycleMapper';

export class PrismaMotorcycleRepository implements IMotorcycleRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(motorcycle: Motorcycle): Promise<void> {
        const prismaData = MotorcycleMapper.toPrismaCreate(motorcycle);
        await this.prisma.motorcycle.create({ data: prismaData });
    }

    async update(motorcycle: Motorcycle): Promise<void> {
        const prismaData = MotorcycleMapper.toPrismaUpdate(motorcycle);
        await this.prisma.motorcycle.update({
            where: { id: motorcycle.id },
            data: prismaData
        });
    }

    async findById(id: string): Promise<Motorcycle | null> {
        const motorcycle = await this.prisma.motorcycle.findUnique({
            where: { id }
        });
        return motorcycle ? MotorcycleMapper.toDomain(motorcycle) : null;
    }

    async findByVin(vin: VIN): Promise<Motorcycle | null> {
        const motorcycle = await this.prisma.motorcycle.findUnique({
            where: { vin: vin.toString() }
        });
        return motorcycle ? MotorcycleMapper.toDomain(motorcycle) : null;
    }

    async updateMileage(motorcycleId: string, newMileage: number): Promise<void> {
        await this.prisma.motorcycle.update({
            where: { id: motorcycleId },
            data: { mileage: newMileage }
        });
    }

    async findByDealership(dealershipId: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { dealershipId }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findByCompany(companyId: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { companyId }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findByStatus(status: MotorcycleStatus): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { status: status as any }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findByModel(model: Model): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: { 
                AND: [
                    { modelType: model.modelType as any }, // Cast nécessaire car les enums diffèrent
                    { year: model.year }
                ]
            }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findAll(): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany();
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async exists(vin: VIN): Promise<boolean> {
        const count = await this.prisma.motorcycle.count({
            where: { vin: vin.toString() }
        });
        return count > 0;
    }

    async findAvailable(dealershipId?: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: {
                status: MotorcycleStatus.AVAILABLE,
                dealershipId: dealershipId || undefined
            }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findInMaintenance(dealershipId?: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: {
                status: MotorcycleStatus.IN_MAINTENANCE,
                dealershipId: dealershipId || undefined
            }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async findInUse(dealershipId?: string): Promise<Motorcycle[]> {
        const motorcycles = await this.prisma.motorcycle.findMany({
            where: {
                status: MotorcycleStatus.IN_USE,
                dealershipId: dealershipId || undefined
            }
        });
        return motorcycles.map(MotorcycleMapper.toDomain);
    }

    async countByStatus(status: MotorcycleStatus, dealershipId?: string): Promise<number> {
        return this.prisma.motorcycle.count({
            where: {
                status,
                dealershipId: dealershipId || undefined
            }
        });
    }

    async countByModel(model: Model, dealershipId?: string): Promise<number> {
        return this.prisma.motorcycle.count({
            where: {
                AND: [
                    { modelType: model.modelType as any },
                    { year: model.year },
                    dealershipId ? { dealershipId } : {}
                ]
            }
        });
    }
}