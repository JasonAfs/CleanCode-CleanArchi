import { Dealership } from "@domain/entities/DealershipEntity";

export interface IDealershipRepository {
    create(dealership: Dealership): Promise<void>;
    update(dealership: Dealership): Promise<void>;
    findById(id: string): Promise<Dealership | null>;
    findByName(name: string): Promise<Dealership | null>;
    findByEmployee(userId: string): Promise<Dealership | null>;
    findAll(): Promise<Dealership[]>;
    findActive(): Promise<Dealership[]>;
    exists(name: string): Promise<boolean>;

    findByMotorcycle(motorcycleId: string): Promise<Dealership | null>;
    findWithAvailableMotorcycles(): Promise<Dealership[]>;
    findWithMotorcyclesInMaintenance(): Promise<Dealership[]>;
    countMotorcycles(dealershipId: string): Promise<number>;
}


