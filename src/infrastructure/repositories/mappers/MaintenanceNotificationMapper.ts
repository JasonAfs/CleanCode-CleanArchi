import { MaintenanceNotification as PrismaMaintenanceNotification } from '@prisma/client';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotificationEntity';

export class MaintenanceNotificationMapper {
  public static toDomain(
    prismaNotification: PrismaMaintenanceNotification,
  ): MaintenanceNotification {
    return MaintenanceNotification.reconstitute({
      id: prismaNotification.id,
      message: prismaNotification.message,
      isRead: prismaNotification.isRead,
      motorcycleId: prismaNotification.motorcycleId,
      dealershipId: prismaNotification.dealershipId,
      companyId: prismaNotification.companyId || undefined,
      createdAt: prismaNotification.createdAt,
      updatedAt: prismaNotification.updatedAt,
    });
  }

  public static toPrismaCreate(notification: MaintenanceNotification): any {
    return {
      id: notification.id,
      message: notification.message,
      isRead: notification.isRead,
      motorcycleId: notification.motorcycleId,
      dealershipId: notification.dealershipId,
      companyId: notification.companyId || null,
    };
  }

  public static toPrismaUpdate(notification: MaintenanceNotification): any {
    return {
      message: notification.message,
      isRead: notification.isRead,
      motorcycleId: notification.motorcycleId,
      dealershipId: notification.dealershipId,
      companyId: notification.companyId || null,
    };
  }
}
