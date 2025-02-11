import { DomainError } from '@domain/errors/DomainError';

export class CompanyValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
