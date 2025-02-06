import { Motorcycle as PrismaMotorcycle } from '@prisma/client';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { Model } from '@domain/value-objects/Model';
import { VIN } from '@domain/value-objects/VIN';
import { MotorcycleModel, MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';


export class MotorcycleMapper {
    public static toDomain(prismaMotorcycle: PrismaMotorcycle): Motorcycle {
        if (!prismaMotorcycle.dealershipId) {
            throw new MotorcycleNotFoundError(
                `Invalid motorcycle state: no dealership found for motorcycle ${prismaMotorcycle.id}`
            );
        }

        const model = Model.create(
            prismaMotorcycle.modelType as MotorcycleModel,
            prismaMotorcycle.year
        );

        return Motorcycle.reconstitute({
            id: prismaMotorcycle.id,
            vin: VIN.create(prismaMotorcycle.vin),
            model,
            color: prismaMotorcycle.color,
            mileage: prismaMotorcycle.mileage,
            status: prismaMotorcycle.status as MotorcycleStatus,
            isActive: prismaMotorcycle.isActive,
            createdAt: prismaMotorcycle.createdAt,
            updatedAt: prismaMotorcycle.updatedAt,
            dealershipId: prismaMotorcycle.dealershipId,
            holder: {
                dealershipId: prismaMotorcycle.dealershipId,
                companyId: prismaMotorcycle.companyId || undefined,
                assignedAt: prismaMotorcycle.assignedAt
            }
        });
    }

    public static toPrismaCreate(motorcycle: Motorcycle): any {
        return {
            id: motorcycle.id,
            vin: motorcycle.vin.toString(),
            modelType: motorcycle.model.modelType,
            year: motorcycle.model.year,
            color: motorcycle.color,
            mileage: motorcycle.mileage,
            status: motorcycle.status,
            isActive: motorcycle.isActive,
            dealershipId: motorcycle.dealershipId,
            companyId: motorcycle.companyId || null,
            assignedAt: motorcycle.holder?.assignedAt || new Date(),
        };
    }

    public static toPrismaUpdate(motorcycle: Motorcycle): any {
        return {
            modelType: motorcycle.model.modelType,
            year: motorcycle.model.year,
            color: motorcycle.color,
            mileage: motorcycle.mileage,
            status: motorcycle.status,
            isActive: motorcycle.isActive,
            dealershipId: motorcycle.dealershipId,
            companyId: motorcycle.companyId || null,
            assignedAt: motorcycle.holder?.assignedAt,
        };
    }
}
