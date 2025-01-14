import { DomainError } from "@domain/errors/DomainError";

export class MotorcycleValidationError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}