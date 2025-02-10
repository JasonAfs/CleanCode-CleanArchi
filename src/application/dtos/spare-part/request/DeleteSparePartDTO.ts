import { UserRole } from '@domain/enums/UserRole';

export interface DeleteSparePartDTO {
  userId: string;
  userRole: UserRole;
  reference: string;
}
