import {
    MotorcycleProps,
    CreateMotorcycleProps,
    ReconstituteMotorcycleProps,
} from '@domain/interfaces/motorcycle/IMotorcycleProps';
import { Model } from '@domain/value-objects/Model';
import { VIN } from '@domain/value-objects/VIN';
import { 
    MotorcycleValidationError, 
    MotorcycleStatusError, 
    MotorcycleAssignmentError 
} from '@domain/errors/motorcycle/MotorcycleValidationError';
import { MotorcycleStatus,MotorcycleModel } from '@domain/enums/MotorcycleEnums';
import { randomUUID } from 'crypto';

export class Motorcycle {
    private readonly props: MotorcycleProps;

    private constructor(props: MotorcycleProps) {
        this.props = props;
    }

    public static create(props: CreateMotorcycleProps): Motorcycle {
        if (!this.isValidColor(props.color)) {
            throw new MotorcycleValidationError('Invalid color format');
        }

        if (!this.isValidMileage(props.mileage)) {
            throw new MotorcycleValidationError('Invalid mileage value');
        }

        return new Motorcycle({
            ...props,
            id: randomUUID(),
            status: MotorcycleStatus.AVAILABLE,
            holder: {
                dealershipId: props.dealershipId,
                assignedAt: new Date()
            },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    public static reconstitute(props: ReconstituteMotorcycleProps): Motorcycle {
        return new Motorcycle(props);
    }

    private static isValidColor(color: string): boolean {
        return color.trim().length > 0;
    }

    private static isValidMileage(mileage: number): boolean {
        return mileage >= 0 && Number.isInteger(mileage);
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get vin(): VIN {
        return this.props.vin;
    }

    get model(): Model {
        return this.props.model;
    }

    get color(): string {
        return this.props.color;
    }

    get mileage(): number {
        return this.props.mileage;
    }

    get status(): MotorcycleStatus {
        return this.props.status;
    }

    get holder(): MotorcycleProps['holder'] {
        return this.props.holder;
    }

    get dealershipId(): string | undefined {
        return this.props.holder?.dealershipId;
    }

    get companyId(): string | undefined {
        return this.props.holder?.companyId;
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

    public updateModel(modelType: MotorcycleModel, year: number): void {
        this.validateActiveState('update model');
    
        const newModel = Model.create(modelType, year);
        this.props.model = newModel;
        this.updateLastModified();
    }

    // Méthodes de validation d'état
    private validateActiveState(operation: string): void {
        if (!this.props.isActive) {
            throw new MotorcycleValidationError(`Cannot ${operation} an inactive motorcycle`);
        }
    }

    private validateTransitionFromStatus(
        currentStatus: MotorcycleStatus,
        newStatus: MotorcycleStatus,
        action: string
    ): void {
        const invalidTransitions: Partial<Record<MotorcycleStatus, MotorcycleStatus[]>> = {
            [MotorcycleStatus.IN_USE]: [MotorcycleStatus.AVAILABLE],
            [MotorcycleStatus.IN_MAINTENANCE]: [MotorcycleStatus.IN_USE],
            [MotorcycleStatus.IN_TRANSIT]: [MotorcycleStatus.IN_USE, MotorcycleStatus.IN_MAINTENANCE],
        };

        const forbiddenTransitions = invalidTransitions[currentStatus];
        if (forbiddenTransitions?.includes(newStatus)) {
            throw new MotorcycleStatusError(
                `Cannot transition from ${currentStatus} to ${newStatus} during ${action}`
            );
        }
    }

    // Méthodes d'état
    public deactivate(): void {
        if (!this.props.isActive) {
            throw new MotorcycleValidationError('Motorcycle is already inactive');
        }

        if (this.props.status === MotorcycleStatus.IN_USE) {
            throw new MotorcycleStatusError('Cannot deactivate motorcycle while in use');
        }

        this.props.status = MotorcycleStatus.OUT_OF_SERVICE;
        this.props.isActive = false;
        this.updateLastModified();
    }

    public activate(): void {
        if (this.props.isActive) {
            throw new MotorcycleValidationError('Motorcycle is already active');
        }
        this.props.status = MotorcycleStatus.AVAILABLE;
        this.props.isActive = true;
        this.updateLastModified();
    }

    // Méthodes de mise à jour du statut
    public setStatus(newStatus: MotorcycleStatus): void {
        this.validateActiveState('change status');
        this.validateTransitionFromStatus(this.props.status, newStatus, 'status change');

        this.props.status = newStatus;
        this.updateLastModified();
    }

    // Méthodes de mise à jour
    public updateMileage(mileage: number): void {
        this.validateActiveState('update mileage');

        if (!Motorcycle.isValidMileage(mileage)) {
            throw new MotorcycleValidationError('Invalid mileage value');
        }

        if (mileage < this.props.mileage) {
            throw new MotorcycleValidationError('New mileage cannot be less than current mileage');
        }

        this.props.mileage = mileage;
        this.updateLastModified();
    }

    public updateColor(color: string): void {
        this.validateActiveState('update color');

        if (!Motorcycle.isValidColor(color)) {
            throw new MotorcycleValidationError('Invalid color format');
        }

        this.props.color = color.trim();
        this.updateLastModified();
    }

    // Méthodes d'attribution
    public assignToCompany(companyId: string): void {
        this.validateActiveState('assign to company');

        if (!this.props.holder) {
            throw new MotorcycleAssignmentError('Motorcycle must be assigned to a dealership first');
        }

        if (this.props.holder.companyId) {
            throw new MotorcycleAssignmentError('Motorcycle is already assigned to a company');
        }

        if (this.props.status !== MotorcycleStatus.AVAILABLE) {
            throw new MotorcycleAssignmentError('Motorcycle is not available for assignment');
        }

        this.props.holder = {
            ...this.props.holder,
            companyId,
            assignedAt: new Date()
        };
        this.props.status = MotorcycleStatus.IN_USE;
        this.updateLastModified();
    }

    public transferToDealership(dealershipId: string): void {
        this.validateActiveState('transfer');

        if (this.props.holder?.dealershipId === dealershipId) {
            throw new MotorcycleAssignmentError('Motorcycle is already assigned to this dealership');
        }

        if (this.props.holder?.companyId) {
            throw new MotorcycleAssignmentError('Cannot transfer motorcycle while assigned to a company');
        }

        if (this.props.status === MotorcycleStatus.IN_MAINTENANCE) {
            throw new MotorcycleStatusError('Cannot transfer motorcycle while in maintenance');
        }

        const previousStatus = this.props.status;
        this.props.status = MotorcycleStatus.IN_TRANSIT;
        this.props.holder = {
            dealershipId,
            assignedAt: new Date()
        };
        
        // Si la moto était disponible avant le transfert, elle le reste après
        if (previousStatus === MotorcycleStatus.AVAILABLE) {
            this.props.status = MotorcycleStatus.AVAILABLE;
        }
        
        this.updateLastModified();
    }

    public releaseFromCompany(): void {
        if (!this.props.holder?.companyId) {
            throw new MotorcycleAssignmentError('Motorcycle is not assigned to any company');
        }

        const { companyId, ...dealershipHolder } = this.props.holder;
        this.props.holder = dealershipHolder;
        this.props.status = MotorcycleStatus.AVAILABLE;
        this.updateLastModified();
    }

    public startMaintenance(): void {
        this.validateActiveState('start maintenance');

        if (this.props.status === MotorcycleStatus.IN_MAINTENANCE) {
            throw new MotorcycleStatusError('Motorcycle is already in maintenance');
        }

        if (this.props.status === MotorcycleStatus.IN_USE) {
            throw new MotorcycleStatusError('Cannot start maintenance while motorcycle is in use');
        }

        if (this.props.status === MotorcycleStatus.IN_TRANSIT) {
            throw new MotorcycleStatusError('Cannot start maintenance while motorcycle is in transit');
        }

        this.props.status = MotorcycleStatus.IN_MAINTENANCE;
        this.updateLastModified();
    }

    public completeMaintenance(): void {
        this.validateActiveState('complete maintenance');

        if (this.props.status !== MotorcycleStatus.IN_MAINTENANCE) {
            throw new MotorcycleStatusError('Motorcycle is not in maintenance');
        }

        this.props.status = MotorcycleStatus.AVAILABLE;
        this.updateLastModified();
    }
}