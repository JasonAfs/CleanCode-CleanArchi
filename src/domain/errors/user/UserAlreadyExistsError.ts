import { DomainError } from '../DomainError';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User already exists with email: ${email}`);
  }
}
