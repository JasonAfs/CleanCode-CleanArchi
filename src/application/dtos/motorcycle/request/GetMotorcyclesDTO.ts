import { UserRole } from '@domain/enums/UserRole';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';

export interface GetMotorcyclesDTO {
  userId: string;
  userRole: UserRole;
  includeInactive?: boolean;
  statusFilter?: MotorcycleStatus;
}
