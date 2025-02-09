import { Maintenance } from '@domain/entities/MaintenanceEntity';
import {
  MaintenanceType,
  MaintenanceStatus,
} from '@domain/enums/MaintenanceEnums';
import { DomainError } from '@domain/errors/DomainError';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';

export class MotorcycleMaintenanceError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MotorcycleMaintenance {
  private constructor(
    private readonly motorcycleId: string,
    private readonly maintenances: Maintenance[],
    private readonly maintenanceInterval: MaintenanceInterval,
    private readonly companyId?: string,
  ) {}

  public static create(
    motorcycleId: string,
    maintenanceInterval: MaintenanceInterval,
    companyId?: string,
  ): MotorcycleMaintenance {
    return new MotorcycleMaintenance(
      motorcycleId,
      [],
      maintenanceInterval,
      companyId,
    );
  }

  // Méthodes de consultation
  public getAll(): Maintenance[] {
    return [...this.maintenances];
  }

  public getAllByStatus(status: MaintenanceStatus): Maintenance[] {
    return this.maintenances.filter(
      (maintenance) => maintenance.status === status,
    );
  }

  public getAllByType(type: MaintenanceType): Maintenance[] {
    return this.maintenances.filter((maintenance) => maintenance.type === type);
  }

  public getLastMaintenance(): Maintenance | undefined {
    return this.maintenances
      .filter((m) => m.status === MaintenanceStatus.COMPLETED)
      .sort(
        (a, b) => b.completedDate!.getTime() - a.completedDate!.getTime(),
      )[0];
  }

  public getUpcomingMaintenances(): Maintenance[] {
    return this.maintenances
      .filter((m) => m.status === MaintenanceStatus.PLANNED)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // Méthodes de calcul
  public isMaintenanceNeeded(currentMileage: number): boolean {
    const lastMaintenance = this.getLastMaintenance();

    if (!lastMaintenance) {
      // Pour une nouvelle moto, vérifier si les seuils sont dépassés
      // depuis sa mise en service (createdAt)
      const monthsSinceCreation = this.getMonthsDifference(
        new Date(this.motorcycleId), // Date de création de la moto
        new Date(),
      );

      return (
        currentMileage >= this.maintenanceInterval.distanceInterval ||
        monthsSinceCreation >= this.maintenanceInterval.timeInterval
      );
    }

    const mileageDifference = currentMileage - lastMaintenance.mileage;
    const monthsDifference = this.getMonthsDifference(
      lastMaintenance.completedDate!,
      new Date(),
    );

    return (
      mileageDifference >= this.maintenanceInterval.distanceInterval ||
      monthsDifference >= this.maintenanceInterval.timeInterval
    );
  }

  public getNextMaintenanceDue(currentMileage: number): {
    dueDate: Date;
    dueMileage: number;
  } {
    const lastMaintenance = this.getLastMaintenance();
    if (!lastMaintenance) {
      return {
        dueDate: new Date(),
        dueMileage: currentMileage,
      };
    }

    const nextDueDate = new Date(lastMaintenance.completedDate!);
    nextDueDate.setMonth(
      nextDueDate.getMonth() + this.maintenanceInterval.timeInterval,
    );

    return {
      dueDate: nextDueDate,
      dueMileage:
        lastMaintenance.mileage + this.maintenanceInterval.distanceInterval,
    };
  }

  // Méthodes d'ajout et de mise à jour
  public addMaintenance(maintenance: Maintenance): MotorcycleMaintenance {
    const existingPlanned = this.getUpcomingMaintenances();
    if (
      maintenance.status === MaintenanceStatus.PLANNED &&
      existingPlanned.some(
        (m) =>
          Math.abs(
            m.scheduledDate.getTime() - maintenance.scheduledDate.getTime(),
          ) <
          24 * 60 * 60 * 1000,
      )
    ) {
      throw new MotorcycleMaintenanceError(
        'A maintenance is already planned for this date',
      );
    }

    return new MotorcycleMaintenance(
      this.motorcycleId,
      [...this.maintenances, maintenance],
      this.maintenanceInterval,
      this.companyId,
    );
  }

  // Méthodes utilitaires privées
  private getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff;
  }
}
