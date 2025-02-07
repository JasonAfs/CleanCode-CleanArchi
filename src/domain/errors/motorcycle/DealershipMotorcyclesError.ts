import { DomainError } from '../DomainError';

export class DealershipMotorcyclesError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
