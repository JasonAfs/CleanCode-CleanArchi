import {
  Motorcycle as PrismaMotorcycle,
  Maintenance as PrismaMaintenance,
} from '@prisma/client';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { Model } from '@domain/value-objects/Model';
import { VIN } from '@domain/value-objects/VIN';
import {
  MotorcycleModel,
  MotorcycleStatus,
} from '@domain/enums/MotorcycleEnums';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { MotorcycleMaintenance } from '@domain/aggregates/motorcycle/MotorcycleMaintenance';
import { MaintenanceMapper } from './MaintenanceMapper';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';
import { MODEL_CHARACTERISTICS } from '@domain/enums/MotorcycleEnums';

export class MotorcycleMapper {
  public static toDomain(
    prismaMotorcycle: PrismaMotorcycle & {
      maintenances?: PrismaMaintenance[];
    },
  ): Motorcycle {
    if (!prismaMotorcycle.dealershipId) {
      throw new MotorcycleNotFoundError(
        `Invalid motorcycle state: no dealership found for motorcycle ${prismaMotorcycle.id}`,
      );
    }

    const model = Model.create(
      prismaMotorcycle.modelType as MotorcycleModel,
      prismaMotorcycle.year,
    );

    const maintenanceInterval = MaintenanceInterval.create(
      MODEL_CHARACTERISTICS[model.modelType].maintenanceInterval.kilometers,
      MODEL_CHARACTERISTICS[model.modelType].maintenanceInterval.months,
    );

    const maintenances =
      prismaMotorcycle.maintenances?.map(MaintenanceMapper.toDomain) || [];
    const motorcycleMaintenance = MotorcycleMaintenance.create(
      prismaMotorcycle.id,
      maintenanceInterval,
      prismaMotorcycle.companyId || undefined,
    );

    maintenances.forEach((maintenance) => {
      motorcycleMaintenance.addMaintenance(maintenance);
    });

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
        assignedAt: prismaMotorcycle.assignedAt,
      },
      maintenance: motorcycleMaintenance,
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
