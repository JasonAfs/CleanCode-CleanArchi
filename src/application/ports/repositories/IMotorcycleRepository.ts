import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { VIN } from '@domain/value-objects/VIN';
import { Model } from '@domain/value-objects/Model';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';

export interface IMotorcycleRepository {
  // Opérations CRUD de base
  create(motorcycle: Motorcycle): Promise<void>;
  update(motorcycle: Motorcycle): Promise<void>; // Réservé pour les mises à jour admin
  findById(id: string): Promise<Motorcycle | null>;
  findByVin(vin: VIN): Promise<Motorcycle | null>;
  findAll(): Promise<Motorcycle[]>;
  exists(vin: VIN): Promise<boolean>;

  // Méthode spécifique pour la mise à jour du kilométrage
  updateMileage(motorcycleId: string, newMileage: number): Promise<void>;

  // Recherches spécifiques
  findByDealership(dealershipId: string): Promise<Motorcycle[]>;
  findByCompany(companyId: string): Promise<Motorcycle[]>;
  findByStatus(status: MotorcycleStatus): Promise<Motorcycle[]>;
  findByModel(model: Model): Promise<Motorcycle[]>;

  // Recherches filtrées
  findAvailable(dealershipId?: string): Promise<Motorcycle[]>;
  findInMaintenance(dealershipId?: string): Promise<Motorcycle[]>;
  findInUse(dealershipId?: string): Promise<Motorcycle[]>;

  // Statistiques
  countByStatus(
    status: MotorcycleStatus,
    dealershipId?: string,
  ): Promise<number>;
  countByModel(model: Model, dealershipId?: string): Promise<number>;

  // Nouvelles méthodes pour la maintenance
  findRequiringMaintenance(
    currentDate: Date,
    dealershipId?: string,
    companyId?: string,
  ): Promise<Motorcycle[]>;

  findByMaintenanceInterval(
    interval: MaintenanceInterval,
    dealershipId?: string,
  ): Promise<Motorcycle[]>;

  updateMaintenanceStatus(
    motorcycleId: string,
    status: MotorcycleStatus.MAINTENANCE | MotorcycleStatus.AVAILABLE,
  ): Promise<void>;
}
