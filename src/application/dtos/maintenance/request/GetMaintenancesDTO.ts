import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';

export interface GetMaintenancesDTO extends BaseAuthenticatedDTO {
  dealershipId?: string;
  companyId?: string;
  motorcycleId?: string;
  status?: MaintenanceStatus;
  type?: MaintenanceType;
  startDate?: Date;
  endDate?: Date;
  includeInactive?: boolean;
}
