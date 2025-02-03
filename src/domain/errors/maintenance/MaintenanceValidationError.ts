import { DomainError } from '@domain/errors/DomainError';

export class MaintenanceValidationError extends DomainError {
    constructor(message: string) {
        super(`Maintenance validation error: ${message}`);
    }
}