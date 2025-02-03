import { DomainError } from '@domain/errors/DomainError';

export class MaintenanceNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`Maintenance record not found with identifier: ${identifier}`);
    }
}