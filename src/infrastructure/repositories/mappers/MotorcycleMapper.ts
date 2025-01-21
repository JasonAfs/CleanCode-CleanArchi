import { Motorcycle as PrismaMotorcycle, MotorcycleStatus as PrismaMotorcycleStatus } from '@prisma/client';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';

export class MotorcycleMapper {
    public static toDomain(prismaMotorcycle: PrismaMotorcycle): Motorcycle {
        const motorcycle = Motorcycle.create({
            vin: prismaMotorcycle.vin,
            dealershipId: prismaMotorcycle.dealershipId,
            model: prismaMotorcycle.model,
            year: prismaMotorcycle.year,
            registrationNumber: prismaMotorcycle.registrationNumber,
            mileage: prismaMotorcycle.mileage
        });

        // Définir les propriétés qui ne peuvent pas être modifiées après la création
        Object.defineProperties(motorcycle, {
            'id': { value: prismaMotorcycle.id },
            'status': { value: prismaMotorcycle.status as MotorcycleStatus },
            'lastMaintenanceDate': { value: prismaMotorcycle.lastMaintenanceDate },
            'nextMaintenanceDate': { value: prismaMotorcycle.nextMaintenanceDate },
            'isActive': { value: prismaMotorcycle.isActive },
            'createdAt': { value: prismaMotorcycle.createdAt },
            'updatedAt': { value: prismaMotorcycle.updatedAt }
        });

        return motorcycle;
    }

    public static toPrisma(motorcycle: Motorcycle): Omit<PrismaMotorcycle, 'createdAt' | 'updatedAt'> {
        return {
            id: motorcycle.id,
            vin: motorcycle.vin,
            dealershipId: motorcycle.dealershipId,
            model: motorcycle.model,
            year: motorcycle.year,
            registrationNumber: motorcycle.registrationNumber,
            mileage: motorcycle.mileage,
            status: motorcycle.status as PrismaMotorcycleStatus,
            lastMaintenanceDate: motorcycle.lastMaintenanceDate,
            nextMaintenanceDate: motorcycle.nextMaintenanceDate,
            isActive: motorcycle.isActive
        };
    }
}