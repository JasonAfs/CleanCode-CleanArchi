import { BaseAuthenticatedDTO } from '@application/dtos/shared/BaseAuthenticatedDTO';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';

export interface GetCompanyMotorcyclesDTO extends BaseAuthenticatedDTO {
  companyId: string;
  includeInactive?: boolean;
  statusFilter?: MotorcycleStatus;
}
