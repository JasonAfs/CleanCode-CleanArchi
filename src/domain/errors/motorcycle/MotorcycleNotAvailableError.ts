import { DomainError } from "@domain/errors/DomainError";

export class MotorcycleNotAvailableError extends DomainError {
    constructor(motorcycleId: string) {
        super(`Motorcycle ${motorcycleId} is not available for assignment`);
    }
}