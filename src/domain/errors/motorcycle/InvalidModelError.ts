import { DomainError } from '../DomainError';

export class InvalidModelError extends DomainError {
  constructor(message: string) {
    super(`Invalid model: ${message}`);
  }
}
