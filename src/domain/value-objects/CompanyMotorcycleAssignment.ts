import { MotorcycleAssignment } from '../interfaces/motorcycle/IMotorcycleAssignment';
import { Motorcycle } from '../entities/MotorcycleEntity';
import { MotorcycleNotAvailableError } from '../errors/motorcycle/MotorcycleNotAvailableError';
import { randomUUID } from 'crypto';

export class CompanyMotorcycleAssignment {
    private constructor(
        private readonly props: MotorcycleAssignment
    ) {}

    public static create(
        companyId: string,
        motorcycle: Motorcycle
    ): CompanyMotorcycleAssignment {
        if (!motorcycle.isAvailable()) {
            throw new MotorcycleNotAvailableError(motorcycle.id);
        }

        motorcycle.markAsInUse();

        return new CompanyMotorcycleAssignment({
            id: randomUUID(),
            companyId,
            motorcycleId: motorcycle.id,
            assignedAt: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public endAssignment(motorcycle: Motorcycle): void {
        if (!this.props.isActive) {
            throw new Error('Assignment is already inactive');
        }

        motorcycle.markAsAvailable();
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }

    get id(): string {
        return this.props.id;
    }

    get motorcycleId(): string {
        return this.props.motorcycleId;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    public toAssignment(): MotorcycleAssignment {
        return { ...this.props };
    }
}