// src/domain/entities/MotorcycleEntity.ts
import { IMotorcycleProps } from "@domain/interfaces/IMotorcycleProps";
import { MotorcycleStatus } from "@domain/enums/MotorcycleStatus";
import { MotorcycleValidationError } from "@domain/errors/motorcycle/MotorcycleValidationError";
import { randomUUID } from "crypto";

export class Motorcycle {
    private readonly props: IMotorcycleProps;

    private constructor(props: IMotorcycleProps) {
        this.props = props;
    }

    public static create(
        props: Omit<IMotorcycleProps, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'status' | 'lastMaintenanceDate' | 'nextMaintenanceDate'>
    ): Motorcycle {
        if (!props.vin?.trim()) {
            throw new MotorcycleValidationError("VIN is required");
        }

        if (!props.dealershipId?.trim()) {
            throw new MotorcycleValidationError("Dealership ID is required");
        }

        if (!props.model?.trim()) {
            throw new MotorcycleValidationError("Model is required");
        }

        if (!props.year || props.year < 1900) {
            throw new MotorcycleValidationError("Invalid year");
        }

        if (props.mileage < 0) {
            throw new MotorcycleValidationError("Mileage cannot be negative");
        }

        return new Motorcycle({
            ...props,
            id: randomUUID(),
            status: MotorcycleStatus.AVAILABLE,
            lastMaintenanceDate: null,
            nextMaintenanceDate: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get vin(): string {
        return this.props.vin;
    }

    get dealershipId(): string {
        return this.props.dealershipId;
    }

    get model(): string {
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

    get lastMaintenanceDate(): Date | null {
        return this.props.lastMaintenanceDate;
    }

    get nextMaintenanceDate(): Date | null {
        return this.props.nextMaintenanceDate;
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

    private updateLastModified(): void {
        this.props.updatedAt = new Date();
    }

    // État et statut
    public isAvailable(): boolean {
        return this.props.status === MotorcycleStatus.AVAILABLE && this.props.isActive;
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
        this.props.lastMaintenanceDate = new Date();
        this.updateLastModified();
    }

    public markAsOutOfService(): void {
        this.props.status = MotorcycleStatus.OUT_OF_SERVICE;
        this.updateLastModified();
    }

    // Mise à jour des informations
    public updateMileage(newMileage: number): void {
        if (newMileage < this.props.mileage) {
            throw new MotorcycleValidationError("New mileage cannot be less than current mileage");
        }
        this.props.mileage = newMileage;
        this.updateLastModified();
    }

    public scheduleNextMaintenance(date: Date): void {
        if (date <= new Date()) {
            throw new MotorcycleValidationError("Next maintenance date must be in the future");
        }
        this.props.nextMaintenanceDate = date;
        this.updateLastModified();
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
}