import { DeactivateDealershipDTO } from '@application/dtos/dealership/request/DeactivateDealershipDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class DeactivateDealershipValidator {
  public validate(dto: DeactivateDealershipDTO): void {
    if (!dto.dealershipId?.trim()) {
      throw new DealershipValidationError('Dealership ID is required');
    }
  }
}
