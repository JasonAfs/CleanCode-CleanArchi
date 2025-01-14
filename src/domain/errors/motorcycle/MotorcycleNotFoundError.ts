import { DomainError } from "@domain/errors/DomainError";

export class MotorcycleNotFoundError extends DomainError {
    constructor(motorcycleId: string) {
        super(`Motorcycle :  ${motorcycleId} doesnt not exist`);
    }
}