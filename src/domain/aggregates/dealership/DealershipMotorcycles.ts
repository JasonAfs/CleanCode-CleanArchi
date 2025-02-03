import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleNotFoundError';
import { MotorcycleModel } from '@domain/enums/MotorcycleModel';
import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';

export class DealershipMotorcycles {
    private constructor(private readonly motorcycles: Motorcycle[]) {}

    public static create(): DealershipMotorcycles {
        return new DealershipMotorcycles([]);
    }

    public static reconstitute(motorcycles: Motorcycle[]): DealershipMotorcycles {
        return new DealershipMotorcycles(motorcycles);
    }

    // Gestion de base
    public addMotorcycle(motorcycle: Motorcycle): DealershipMotorcycles {
        if (this.hasMotorcycle(motorcycle.id)) {
            throw new DealershipValidationError("Motorcycle already exists in this dealership");
        }

        return new DealershipMotorcycles([...this.motorcycles, motorcycle]);
    }

    public removeMotorcycle(motorcycleId: string): DealershipMotorcycles {
        if (!this.hasMotorcycle(motorcycleId)) {
            throw new MotorcycleNotFoundError(motorcycleId);
        }

        return new DealershipMotorcycles(
            this.motorcycles.filter(motorcycle => motorcycle.id !== motorcycleId)
        );
    }

    public hasMotorcycle(motorcycleId: string): boolean {
        return this.motorcycles.some(motorcycle => motorcycle.id === motorcycleId);
    }

    public getMotorcycleById(motorcycleId: string): Motorcycle | undefined {
        return this.motorcycles.find(motorcycle => motorcycle.id === motorcycleId);
    }

    // Méthodes de filtrage et recherche
    public getAvailableMotorcycles(): Motorcycle[] {
        return this.motorcycles.filter(motorcycle => motorcycle.isAvailable());
    }

    public getMotorcyclesByModel(model: MotorcycleModel): Motorcycle[] {
        return this.motorcycles.filter(motorcycle => motorcycle.model === model);
    }

    public getMotorcyclesByStatus(status: MotorcycleStatus): Motorcycle[] {
        return this.motorcycles.filter(motorcycle => motorcycle.status === status);
    }

    public getActiveMotorcycles(): Motorcycle[] {
        return this.motorcycles.filter(motorcycle => motorcycle.isActive);
    }

    // Méthodes liées à la maintenance
    public getMotorcyclesRequiringMaintenance(): Motorcycle[] {
        return this.motorcycles.filter(motorcycle => motorcycle.needsMaintenance());
    }

    public getMotorcyclesInMaintenance(): Motorcycle[] {
        return this.getMotorcyclesByStatus(MotorcycleStatus.MAINTENANCE);
    }

    // Statistiques et rapports
    public getTotalMotorcyclesCount(): number {
        return this.motorcycles.length;
    }

    public getActiveMotorcyclesCount(): number {
        return this.getActiveMotorcycles().length;
    }

    public getAvailableMotorcyclesCount(): number {
        return this.getAvailableMotorcycles().length;
    }

    public getMaintenanceStatistics(): {
        requireMaintenance: number;
        inMaintenance: number;
        availableForUse: number;
        totalActive: number;
    } {
        return {
            requireMaintenance: this.getMotorcyclesRequiringMaintenance().length,
            inMaintenance: this.getMotorcyclesInMaintenance().length,
            availableForUse: this.getAvailableMotorcycles().length,
            totalActive: this.getActiveMotorcycles().length
        };
    }

    // Méthodes d'accès aux données
    public getAll(): Motorcycle[] {
        return [...this.motorcycles];
    }

    public getSortedByMileage(): Motorcycle[] {
        return [...this.motorcycles].sort((a, b) => b.mileage - a.mileage);
    }

    public getSortedByNextMaintenance(): Motorcycle[] {
        return [...this.motorcycles].sort((a, b) => {
            const aInfo = a.getNextMaintenanceInfo();
            const bInfo = b.getNextMaintenanceInfo();
            return aInfo.dueDate.getTime() - bInfo.dueDate.getTime();
        });
    }
}