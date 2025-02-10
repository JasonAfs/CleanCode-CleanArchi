import { UserRole } from '@domain/enums/UserRole';

export interface GetSparePartDetailsDTO {
  userId: string;
  userRole: UserRole;
  reference: string;
}
