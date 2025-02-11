import { DomainError } from '../DomainError';

export class CompanyMotorcyclesError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
