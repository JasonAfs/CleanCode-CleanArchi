import { DomainError } from '../DomainError';

export class UserValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
