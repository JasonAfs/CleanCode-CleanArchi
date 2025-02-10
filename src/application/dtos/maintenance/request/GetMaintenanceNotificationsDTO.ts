import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface GetMaintenanceNotificationsDTO extends BaseAuthenticatedDTO {
  dealershipId?: string;
  companyId?: string;
  includeRead?: boolean;
  page?: number;
  limit?: number;
}
