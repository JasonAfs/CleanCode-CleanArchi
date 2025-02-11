import { GetDealershipEmployeesDTO } from '@application/dtos/dealership/request/GetDealershipEmployeesDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { UserRole } from '@domain/enums/UserRole';

export class GetDealershipEmployeesValidator {
  private readonly dealershipRoles = [
    UserRole.DEALERSHIP_MANAGER,
    UserRole.DEALERSHIP_EMPLOYEE,
    UserRole.DEALERSHIP_TECHNICIAN,
    UserRole.DEALERSHIP_STOCK_MANAGER,
  ];

  public validate(dto: GetDealershipEmployeesDTO): void {
    if (!dto.dealershipId?.trim()) {
      throw new DealershipValidationError('Dealership ID is required');
    }

    if (dto.roleFilter && !this.dealershipRoles.includes(dto.roleFilter)) {
      throw new DealershipValidationError('Invalid dealership role filter');
    }
  }
}
