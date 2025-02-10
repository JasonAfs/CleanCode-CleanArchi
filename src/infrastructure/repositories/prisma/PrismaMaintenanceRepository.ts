import { PrismaClient } from '@prisma/client';
import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { Maintenance } from '@domain/entities/MaintenanceEntity';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';
import { MaintenanceMapper } from '../mappers/MaintenanceMapper';
import { MaintenanceFilters } from '@application/ports/repositories/IMaintenanceRepository';

export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(maintenance: Maintenance): Promise<void> {
    const prismaData = MaintenanceMapper.toPrismaCreate(maintenance);
    await this.prisma.maintenance.create({ data: prismaData });
  }

  async update(maintenance: Maintenance): Promise<void> {
    const prismaData = MaintenanceMapper.toPrismaUpdate(maintenance);
    await this.prisma.maintenance.update({
      where: { id: maintenance.id },
      data: prismaData,
    });
  }

  async findById(id: string): Promise<Maintenance | null> {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });
    return maintenance ? MaintenanceMapper.toDomain(maintenance) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.maintenance.delete({ where: { id } });
  }

  async findByMotorcycleId(motorcycleId: string): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: { motorcycleId },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findByDealershipId(dealershipId: string): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: { dealershipId },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: { status },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findByType(type: MaintenanceType): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: { type },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findUpcomingMaintenances(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
  ): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: {
        scheduledDate: {
          gte: startDate,
          lte: endDate,
        },
        dealershipId: dealershipId,
        status: MaintenanceStatus.PLANNED,
      },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findLastMaintenanceByMotorcycleId(
    motorcycleId: string,
    type?: MaintenanceType,
  ): Promise<Maintenance | null> {
    const maintenance = await this.prisma.maintenance.findFirst({
      where: {
        motorcycleId,
        type: type,
        status: MaintenanceStatus.COMPLETED,
      },
      orderBy: {
        completedDate: 'desc',
      },
    });
    return maintenance ? MaintenanceMapper.toDomain(maintenance) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.maintenance.count({
      where: { id },
    });
    return count > 0;
  }

  async hasOverlappingMaintenance(
    motorcycleId: string,
    date: Date,
    excludeId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.maintenance.count({
      where: {
        motorcycleId,
        scheduledDate: {
          gte: new Date(date.getTime() - 24 * 60 * 60 * 1000), // 1 jour avant
          lte: new Date(date.getTime() + 24 * 60 * 60 * 1000), // 1 jour après
        },
        status: MaintenanceStatus.PLANNED,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count > 0;
  }

  async findMaintenancesDue(
    maxDate: Date,
    maxMileage: number,
  ): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: {
        scheduledDate: { lte: maxDate },
        mileage: { lte: maxMileage },
        status: MaintenanceStatus.PLANNED,
      },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findMaintenancesByDateRange(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
  ): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: {
        scheduledDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(dealershipId && { dealershipId }),
      },
    });
    return maintenances.map(MaintenanceMapper.toDomain);
  }

  async findMaintenancesByFilters(
    filters: MaintenanceFilters,
  ): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: {
        scheduledDate: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
        ...(filters.dealershipId && { dealershipId: filters.dealershipId }),
        ...(filters.companyId && {
          motorcycle: {
            company: {
              id: filters.companyId,
            },
          },
        }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.motorcycleId && { motorcycleId: filters.motorcycleId }),
      },
      include: {
        motorcycle: {
          include: {
            company: true,
          },
        },
      },
    });

    return maintenances.map(MaintenanceMapper.toDomain);
  }
}
