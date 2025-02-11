import { DomainError } from '../DomainError';

export class MaintenanceNotificationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
