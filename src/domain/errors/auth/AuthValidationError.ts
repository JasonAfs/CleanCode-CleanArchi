import { DomainError } from '@domain/errors/DomainError';

export class AuthValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
