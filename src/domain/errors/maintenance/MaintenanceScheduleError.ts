import { DomainError } from '@domain/errors/DomainError';

export class MaintenanceScheduleError extends DomainError {
    constructor(message: string) {
        super(`Maintenance schedule error: ${message}`);
    }
}