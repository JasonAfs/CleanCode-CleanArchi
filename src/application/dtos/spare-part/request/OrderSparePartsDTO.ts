import { UserRole } from '@domain/enums/UserRole';

export interface OrderSparePartsDTO {
  dealershipId: string;
  userId: string;
  userRole: UserRole;
  items: Array<{
    sparePartReference: string;
    quantity: number;
  }>;
  estimatedDeliveryDate?: Date;
}
