import { DomainError } from '@domain/errors/DomainError';

export class MotorcycleValidationError extends DomainError {
  constructor(message: string) {
    super(`Motorcycle validation error: ${message}`);
  }
}

export class MotorcycleNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Motorcycle not found with identifier: ${identifier}`);
  }
}

export class MotorcycleAssignmentError extends DomainError {
  constructor(message: string) {
    super(`Motorcycle assignment error: ${message}`);
  }
}

export class MotorcycleStatusError extends DomainError {
  constructor(message: string) {
    super(`Invalid motorcycle status transition: ${message}`);
  }
}
