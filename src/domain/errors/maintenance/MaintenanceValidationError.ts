import { DomainError } from '../DomainError';

export class MaintenanceValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
