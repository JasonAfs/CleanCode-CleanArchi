import { MaintenanceRecord, MaintenanceType, SparePart } from '@domain/interfaces/maintenance/IMaintenanceProps';
import { MaintenanceSchedule } from '@domain/value-objects/MaintenanceSchedule';
import { DomainError } from '@domain/errors/DomainError';
import { randomUUID } from 'crypto';

export class MaintenanceValidationError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class MotorcycleMaintenance {
    private constructor(
        private readonly maintenanceHistory: MaintenanceRecord[],
        private readonly maintenanceSchedule: MaintenanceSchedule,
        private readonly motorcycleId: string
    ) {}

    public static create(motorcycleId: string, maintenanceSchedule: MaintenanceSchedule): MotorcycleMaintenance {
        return new MotorcycleMaintenance([], maintenanceSchedule, motorcycleId);
    }

    public static reconstitute(
        maintenanceHistory: MaintenanceRecord[],
        maintenanceSchedule: MaintenanceSchedule,
        motorcycleId: string
    ): MotorcycleMaintenance {
        return new MotorcycleMaintenance(
            maintenanceHistory,
            maintenanceSchedule,
            motorcycleId
        );
    }

    public addMaintenanceRecord(
        params: {
            date: Date,
            type: MaintenanceType,
            mileage: number,
            description: string,
            spareParts: Omit<SparePart, 'id'>[],
            technicianId: string,
            technicianRecommendations?: string,
            warrantyWork: boolean
        }
    ): MotorcycleMaintenance {
        this.validateMaintenance(params);

        const spareParts = params.spareParts.map(part => ({
            ...part,
            id: randomUUID()
        }));

        const totalCost = this.calculateTotalCost(spareParts, params.warrantyWork);

        const newRecord: MaintenanceRecord = {
            id: randomUUID(),
            date: params.date,
            type: params.type,
            mileage: params.mileage,
            description: params.description,
            spareParts,
            technicianId: params.technicianId,
            technicianRecommendations: params.technicianRecommendations,
            totalCost,
            warrantyWork: params.warrantyWork,
            createdAt: new Date()
        };

        return new MotorcycleMaintenance(
            [...this.maintenanceHistory, newRecord],
            this.maintenanceSchedule,
            this.motorcycleId
        );
    }

    private validateMaintenance(params: {
        date: Date,
        mileage: number,
        description: string,
        technicianId: string
    }): void {
        if (params.date > new Date()) {
            throw new MaintenanceValidationError("Maintenance date cannot be in the future");
        }

        if (params.mileage < 0) {
            throw new MaintenanceValidationError("Mileage cannot be negative");
        }

        if (!params.description?.trim()) {
            throw new MaintenanceValidationError("Maintenance description is required");
        }

        if (!params.technicianId?.trim()) {
            throw new MaintenanceValidationError("Technician ID is required");
        }
    }

    private calculateTotalCost(spareParts: SparePart[], isWarrantyWork: boolean): number {
        if (isWarrantyWork) {
            return 0;
        }
        return spareParts.reduce((total, part) => total + (part.cost * part.quantity), 0);
    }

    public getLastMaintenance(): MaintenanceRecord | null {
        if (this.maintenanceHistory.length === 0) {
            return null;
        }
        return this.maintenanceHistory[this.maintenanceHistory.length - 1];
    }

    public getMaintenancesByType(type: MaintenanceType): MaintenanceRecord[] {
        return this.maintenanceHistory.filter(record => record.type === type);
    }

    public getMaintenancesInDateRange(startDate: Date, endDate: Date): MaintenanceRecord[] {
        return this.maintenanceHistory.filter(record => 
            record.date >= startDate && record.date <= endDate
        );
    }

    public getTotalMaintenanceCost(): number {
        return this.maintenanceHistory.reduce((total, record) => total + record.totalCost, 0);
    }

    public getWarrantyMaintenances(): MaintenanceRecord[] {
        return this.maintenanceHistory.filter(record => record.warrantyWork);
    }

    public getMaintenanceHistory(): MaintenanceRecord[] {
        return [...this.maintenanceHistory];
    }

    public isMaintenanceRequired(currentMileage: number, lastMaintenanceDate: Date | null): boolean {
        return this.maintenanceSchedule.isMaintenanceRequired(currentMileage, lastMaintenanceDate);
    }

    public getNextScheduledMaintenance(currentMileage: number): {
        dueDate: Date;
        dueMileage: number;
    } {
        const lastMaintenance = this.getLastMaintenance();
        const lastMaintenanceDate = lastMaintenance?.date || null;

        return {
            dueDate: this.maintenanceSchedule.getNextMaintenanceDate(lastMaintenanceDate),
            dueMileage: this.maintenanceSchedule.getNextMaintenanceDistance(currentMileage)
        };
    }
}