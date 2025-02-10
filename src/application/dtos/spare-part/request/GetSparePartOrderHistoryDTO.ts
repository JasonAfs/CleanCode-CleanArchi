import { UserRole } from '@domain/enums/UserRole';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

export interface GetSparePartOrderHistoryDTO {
  dealershipId?: string;
  userId: string;
  userRole: UserRole;
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus;
}
