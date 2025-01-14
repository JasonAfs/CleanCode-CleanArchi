import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';

export interface IMotorcycleRepository {
    create(motorcycle: Motorcycle): Promise<void>;
    update(motorcycle: Motorcycle): Promise<void>;
    findById(id: string): Promise<Motorcycle | null>;
    findByVin(vin: string): Promise<Motorcycle | null>;
    findByDealershipId(dealershipId: string): Promise<Motorcycle[]>;
    findByStatus(status: MotorcycleStatus): Promise<Motorcycle[]>;
    findAvailableByDealership(dealershipId: string): Promise<Motorcycle[]>;
    exists(vin: string): Promise<boolean>;
    findAll(): Promise<Motorcycle[]>;
    findActive(): Promise<Motorcycle[]>;
    findDueForMaintenance(before: Date): Promise<Motorcycle[]>;
}