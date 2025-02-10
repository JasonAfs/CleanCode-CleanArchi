import { PrismaClient } from '@prisma/client';
import { IMaintenanceNotificationRepository } from '@application/ports/repositories/IMaintenanceNotificationRepository';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotificationEntity';
import { MaintenanceNotificationMapper } from '../mappers/MaintenanceNotificationMapper';

export class PrismaMaintenanceNotificationRepository
  implements IMaintenanceNotificationRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(notification: MaintenanceNotification): Promise<void> {
    const prismaData =
      MaintenanceNotificationMapper.toPrismaCreate(notification);
    await this.prisma.maintenanceNotification.create({ data: prismaData });
  }

  async update(notification: MaintenanceNotification): Promise<void> {
    const prismaData =
      MaintenanceNotificationMapper.toPrismaUpdate(notification);
    await this.prisma.maintenanceNotification.update({
      where: { id: notification.id },
      data: prismaData,
    });
  }

  async findById(id: string): Promise<MaintenanceNotification | null> {
    const notification = await this.prisma.maintenanceNotification.findUnique({
      where: { id },
    });
    return notification
      ? MaintenanceNotificationMapper.toDomain(notification)
      : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.maintenanceNotification.delete({ where: { id } });
  }

  async findByMotorcycleId(
    motorcycleId: string,
  ): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: { motorcycleId },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async findByDealershipId(
    dealershipId: string,
  ): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: { dealershipId },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async findByCompanyId(companyId: string): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: { companyId },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async findUnreadByDealershipId(
    dealershipId: string,
  ): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: {
        dealershipId,
        isRead: false,
      },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async findUnreadByCompanyId(
    companyId: string,
  ): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: {
        companyId,
        isRead: false,
      },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.maintenanceNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(
    dealershipId?: string,
    companyId?: string,
  ): Promise<void> {
    await this.prisma.maintenanceNotification.updateMany({
      where: {
        OR: [{ dealershipId: dealershipId }, { companyId: companyId }].filter(
          Boolean,
        ), // Filtre les conditions undefined
      },
      data: { isRead: true },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
    companyId?: string,
  ): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(dealershipId && { dealershipId }),
        ...(companyId && { companyId }),
      },
    });
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.maintenanceNotification.count({
      where: { id },
    });
    return count > 0;
  }

  async findAll(): Promise<MaintenanceNotification[]> {
    const notifications = await this.prisma.maintenanceNotification.findMany();
    return notifications.map(MaintenanceNotificationMapper.toDomain);
  }
}
