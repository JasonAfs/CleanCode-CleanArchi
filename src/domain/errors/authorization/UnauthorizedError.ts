import { DomainError } from '@domain/errors/DomainError';

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(`Unauthorized: ${message}`);
  }
}
