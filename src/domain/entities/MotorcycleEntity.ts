import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';
import { MotorcycleModel } from '@domain/enums/MotorcycleModel';
import { MotorcycleValidationError } from '@domain/errors/motorcycle/MotorcycleValidationError';
import { MaintenanceSchedule } from '@domain/value-objects/MaintenanceSchedule';
import { VIN } from '@domain/value-objects/VIN';
import { MotorcycleMaintenance } from '@domain/aggregates/maintenance/MotorcycleMaintenance';
import { MaintenanceType, SparePart } from '@domain/interfaces/maintenance/IMaintenanceProps';
import { randomUUID } from 'crypto';
import { MotorcycleProps, CreateMotorcycleProps, ReconstituteMotorcycleProps } from '@domain/interfaces/motorcycle/IMotorcycleProps';

export class Motorcycle {
    private readonly props: MotorcycleProps;

    private constructor(props: MotorcycleProps) {
        this.props = props;
    }

    public static create(props: CreateMotorcycleProps): Motorcycle {
        if (!props.dealershipId?.trim()) {
            throw new MotorcycleValidationError("Dealership ID is required");
        }

        if (props.year < 1900) {
            throw new MotorcycleValidationError("Invalid year");
        }

        if (props.mileage < 0) {
            throw new MotorcycleValidationError("Mileage cannot be negative");
        }

        const vin = VIN.create(props.vin);
        const maintenanceSchedule = MaintenanceSchedule.forModel(props.model);
        const id = randomUUID();
        const maintenanceHistory = MotorcycleMaintenance.create(id, maintenanceSchedule);

        return new Motorcycle({
            ...props,
            id,
            vin,
            status: MotorcycleStatus.AVAILABLE,
            maintenanceSchedule,
            maintenanceHistory,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static reconstitute(props: ReconstituteMotorcycleProps): Motorcycle {
        const maintenanceSchedule = MaintenanceSchedule.forModel(props.model);
        return new Motorcycle({
            ...props,
            maintenanceSchedule
        });
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get vin(): string {
        return this.props.vin.toString();
    }

    get dealershipId(): string {
        return this.props.dealershipId;
    }

    get model(): MotorcycleModel {
        return this.props.model;
    }

    get year(): number {
        return this.props.year;
    }

    get registrationNumber(): string {
        return this.props.registrationNumber;
    }

    get mileage(): number {
        return this.props.mileage;
    }

    get status(): MotorcycleStatus {
        return this.props.status;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // État et statut
    public isAvailable(): boolean {
        return this.props.status === MotorcycleStatus.AVAILABLE && this.props.isActive;
    }

    public needsMaintenance(): boolean {
        const lastMaintenance = this.props.maintenanceHistory.getLastMaintenance();
        return this.props.maintenanceHistory.isMaintenanceRequired(
            this.props.mileage,
            lastMaintenance?.date || null
        );
    }

    public deactivate(): void {
        this.props.isActive = false;
        this.updateLastModified();
    }

    public activate(): void {
        this.props.isActive = true;
        this.updateLastModified();
    }

    // Méthodes de gestion du statut
    public markAsInUse(): void {
        if (!this.isAvailable()) {
            throw new MotorcycleValidationError("Motorcycle must be available to be marked as in use");
        }
        this.props.status = MotorcycleStatus.IN_USE;
        this.updateLastModified();
    }

    public markAsAvailable(): void {
        if (this.props.status === MotorcycleStatus.MAINTENANCE) {
            throw new MotorcycleValidationError("Cannot mark as available while in maintenance");
        }
        this.props.status = MotorcycleStatus.AVAILABLE;
        this.updateLastModified();
    }

    public markAsInMaintenance(): void {
        this.props.status = MotorcycleStatus.MAINTENANCE;
        this.updateLastModified();
    }

    public markAsOutOfService(): void {
        this.props.status = MotorcycleStatus.OUT_OF_SERVICE;
        this.updateLastModified();
    }

    // Méthodes de maintenance
    public getNextMaintenanceInfo(): { dueDate: Date; dueMileage: number } {
        return this.props.maintenanceHistory.getNextScheduledMaintenance(this.props.mileage);
    }

    public performMaintenance(params: {
        type: MaintenanceType,
        description: string,
        spareParts: Omit<SparePart, 'id'>[],
        technicianId: string,
        technicianRecommendations?: string,
        warrantyWork: boolean
    }): void {
        if (this.props.status !== MotorcycleStatus.MAINTENANCE) {
            throw new MotorcycleValidationError("Motorcycle must be in maintenance status");
        }
    
        this.props.maintenanceHistory = this.props.maintenanceHistory.addMaintenanceRecord({
            ...params,
            date: new Date(),
            mileage: this.props.mileage
        });
    
        if (params.type === MaintenanceType.PREVENTIVE) {
            const nextMaintenanceInfo = this.getNextMaintenanceInfo();
            
            // Vérification que le prochain kilométrage de maintenance est cohérent
            if (nextMaintenanceInfo.dueMileage <= this.props.mileage) {
                throw new MotorcycleValidationError("Next maintenance mileage must be greater than current mileage");
            }
    
            // On peut marquer la moto comme disponible après une maintenance préventive
            this.props.status = MotorcycleStatus.AVAILABLE;
        }
        
        this.updateLastModified();
    }

    public getMaintenanceHistory() {
        return this.props.maintenanceHistory.getMaintenanceHistory();
    }

    public getMaintenanceCosts(): number {
        return this.props.maintenanceHistory.getTotalMaintenanceCost();
    }

    // Mise à jour des informations
    public updateMileage(newMileage: number): { requiresMaintenance: boolean; nextMaintenanceIn: number } {
        if (newMileage < this.props.mileage) {
            throw new MotorcycleValidationError("New mileage cannot be less than current mileage");
        }
        
        this.props.mileage = newMileage;
        this.updateLastModified();
    
        const requiresMaintenance = this.needsMaintenance();
        const nextMaintenanceInfo = this.getNextMaintenanceInfo();
        const nextMaintenanceIn = nextMaintenanceInfo.dueMileage - newMileage;
    
        return {
            requiresMaintenance,
            nextMaintenanceIn
        };
    }

    public transferToDealership(newDealershipId: string): void {
        if (!newDealershipId?.trim()) {
            throw new MotorcycleValidationError("New dealership ID is required");
        }
        
        if (newDealershipId === this.dealershipId) {
            throw new MotorcycleValidationError("New dealership must be different from current dealership");
        }

        this.props.dealershipId = newDealershipId.trim();
        this.updateLastModified();
    }

    private updateLastModified(): void {
        this.props.updatedAt = new Date();
    }
}