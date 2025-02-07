import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { UserRole } from '@domain/enums/UserRole';

export interface GetDealershipMotorcyclesDTO extends BaseAuthenticatedDTO {
  dealershipId: string;
  userId: string;
  userRole: UserRole;
  userDealershipId?: string;
  statusFilter?: MotorcycleStatus;
  includeInactive?: boolean;
}
