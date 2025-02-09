import { Maintenance as PrismaMaintenance } from '@prisma/client';
import { Maintenance } from '@domain/entities/MaintenanceEntity';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';

export class MaintenanceMapper {
  public static toDomain(prismaMaintenance: PrismaMaintenance): Maintenance {
    return Maintenance.reconstitute({
      id: prismaMaintenance.id,
      type: prismaMaintenance.type as MaintenanceType,
      status: prismaMaintenance.status as MaintenanceStatus,
      description: prismaMaintenance.description,
      mileage: prismaMaintenance.mileage,
      scheduledDate: prismaMaintenance.scheduledDate,
      completedDate: prismaMaintenance.completedDate || undefined,
      motorcycleId: prismaMaintenance.motorcycleId,
      dealershipId: prismaMaintenance.dealershipId,
      createdAt: prismaMaintenance.createdAt,
      updatedAt: prismaMaintenance.updatedAt,
      spareParts: [],
      recommendations: [],
    });
  }

  public static toPrismaCreate(maintenance: Maintenance): any {
    return {
      id: maintenance.id,
      type: maintenance.type,
      status: maintenance.status,
      description: maintenance.description,
      mileage: maintenance.mileage,
      scheduledDate: maintenance.scheduledDate,
      completedDate: maintenance.completedDate || null,
      motorcycleId: maintenance.motorcycleId,
      dealershipId: maintenance.dealershipId,
    };
  }

  public static toPrismaUpdate(maintenance: Maintenance): any {
    return {
      type: maintenance.type,
      status: maintenance.status,
      description: maintenance.description,
      mileage: maintenance.mileage,
      scheduledDate: maintenance.scheduledDate,
      completedDate: maintenance.completedDate || null,
      motorcycleId: maintenance.motorcycleId,
      dealershipId: maintenance.dealershipId,
    };
  }
}
