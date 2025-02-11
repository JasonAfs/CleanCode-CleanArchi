import { DomainError } from '@domain/errors/DomainError';

export class DealershipSparePartsStockError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
