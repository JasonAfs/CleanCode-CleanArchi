import { UserRole } from '@domain/enums/UserRole';
import { SparePartCategory } from '@domain/value-objects/SparePart';

export interface GetSparePartsDTO {
  userId: string;
  userRole: UserRole;
  category?: SparePartCategory;
  manufacturer?: string;
  compatibleModel?: string;
}
