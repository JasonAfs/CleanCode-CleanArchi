import { DomainError } from '../../../errors/DomainError';

export class InvalidVINError extends DomainError {
  constructor(message: string) {
    super(`Invalid VIN: ${message}`);
  }
}
