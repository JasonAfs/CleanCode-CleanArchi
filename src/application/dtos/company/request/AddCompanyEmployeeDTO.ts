import { UserRole } from '@domain/enums/UserRole';
import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface AddCompanyEmployeeDTO extends BaseAuthenticatedDTO {
  companyId: string;
  employeeId: string;
  role: UserRole;
  dealershipId?: string;
}
