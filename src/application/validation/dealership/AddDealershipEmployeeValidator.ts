// src/application/validation/dealership/AddEmployeeValidator.ts
import { AddDealershipEmployeeDTO } from '@application/dtos/dealership/request/AddDealershipEmployeeDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class AddDealershipEmployeeValidator {
  public validate(dto: AddDealershipEmployeeDTO): void {
    if (!dto.dealershipId?.trim()) {
      throw new DealershipValidationError('Dealership ID is required');
    }

    if (!dto.employeeId?.trim()) {
      throw new DealershipValidationError('Employee ID is required');
    }
  }
}
