import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { DomainError } from '@domain/errors/DomainError';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { UserRole } from '@domain/enums/UserRole';

export class DealershipMotorcyclesError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class DealershipMotorcycles {
    private constructor(private readonly motorcycles: Motorcycle[]) {}

    public static create(): DealershipMotorcycles {
        return new DealershipMotorcycles([]);
    }

    public addMotorcycle(motorcycle: Motorcycle, userRole: UserRole): DealershipMotorcycles {
        if (userRole !== UserRole.TRIUMPH_ADMIN) {
            throw new DealershipMotorcyclesError(
                'Only TRIUMPH_ADMIN can add motorcycles to dealership fleet'
            );
        }

        if (motorcycle.dealershipId) {
            throw new DealershipMotorcyclesError(
                'Motorcycle is already assigned to a dealership'
            );
        }

        if (this.hasMotorcycle(motorcycle.id)) {
            throw new DealershipMotorcyclesError(
                'Motorcycle already exists in this dealership'
            );
        }

        return new DealershipMotorcycles([...this.motorcycles, motorcycle]);
    }

    public removeMotorcycle(motorcycleId: string, userRole: UserRole): DealershipMotorcycles {
        if (userRole !== UserRole.TRIUMPH_ADMIN) {
            throw new DealershipMotorcyclesError(
                'Only TRIUMPH_ADMIN can remove motorcycles from dealership fleet'
            );
        }

        const motorcycle = this.getMotorcycleById(motorcycleId);
        if (!motorcycle) {
            throw new DealershipMotorcyclesError('Motorcycle not found in this dealership');
        }

        if (motorcycle.status === MotorcycleStatus.IN_USE) {
            throw new DealershipMotorcyclesError(
                'Cannot remove motorcycle while it is in use'
            );
        }

        if (motorcycle.status === MotorcycleStatus.IN_MAINTENANCE) {
            throw new DealershipMotorcyclesError(
                'Cannot remove motorcycle while it is in maintenance'
            );
        }

        const newMotorcycles = this.motorcycles.filter(
            (moto) => moto.id !== motorcycleId
        );

        return new DealershipMotorcycles(newMotorcycles);
    }

    // Méthodes de consultation
    public hasMotorcycle(motorcycleId: string): boolean {
        return this.motorcycles.some((motorcycle) => motorcycle.id === motorcycleId);
    }

    public getMotorcycleById(motorcycleId: string): Motorcycle | undefined {
        return this.motorcycles.find((motorcycle) => motorcycle.id === motorcycleId);
    }

    public getAll(): Motorcycle[] {
        return [...this.motorcycles];
    }

    public getByStatus(status: MotorcycleStatus): Motorcycle[] {
        return this.motorcycles.filter(
            (motorcycle) => motorcycle.status === status
        );
    }

    public getAvailableMotorcycles(): Motorcycle[] {
        return this.getByStatus(MotorcycleStatus.AVAILABLE);
    }

    public getInMaintenanceMotorcycles(): Motorcycle[] {
        return this.getByStatus(MotorcycleStatus.IN_MAINTENANCE);
    }

    public getInUseMotorcycles(): Motorcycle[] {
        return this.getByStatus(MotorcycleStatus.IN_USE);
    }

    // Getter
    get totalMotorcycles(): number {
        return this.motorcycles.length;
    }
}