import { Maintenance } from '@domain/entities/MaintenanceEntity';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';

export interface IMaintenanceRepository {
  // Opérations de base
  create(maintenance: Maintenance): Promise<void>;
  update(maintenance: Maintenance): Promise<void>;
  findById(id: string): Promise<Maintenance | null>;
  delete(id: string): Promise<void>;

  // Recherches spécifiques
  findByMotorcycleId(motorcycleId: string): Promise<Maintenance[]>;
  findByDealershipId(dealershipId: string): Promise<Maintenance[]>;

  // Filtres de recherche
  findByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
  findByType(type: MaintenanceType): Promise<Maintenance[]>;

  // Recherches pour la planification
  findUpcomingMaintenances(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
  ): Promise<Maintenance[]>;

  findLastMaintenanceByMotorcycleId(
    motorcycleId: string,
    type?: MaintenanceType,
  ): Promise<Maintenance | null>;

  // Recherches pour les notifications
  findMaintenancesDue(
    maxDate: Date,
    maxMileage: number,
  ): Promise<Maintenance[]>;

  // Recherches pour les rapports
  findMaintenancesByDateRange(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
  ): Promise<Maintenance[]>;

  // Vérifications
  exists(id: string): Promise<boolean>;
  hasOverlappingMaintenance(
    motorcycleId: string,
    date: Date,
    excludeId?: string,
  ): Promise<boolean>;
}
