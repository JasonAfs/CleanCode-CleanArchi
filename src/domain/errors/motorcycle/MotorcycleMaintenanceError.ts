import { DomainError } from '@domain/errors/DomainError';

export class MotorcycleMaintenanceError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
