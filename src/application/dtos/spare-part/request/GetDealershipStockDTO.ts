import { UserRole } from '@domain/enums/UserRole';

export interface GetDealershipStockRequestDTO {
  dealershipId: string;
  userId: string;
  userRole: UserRole;
}

export interface GetDealershipStockResponseDTO {
  reference: string;
  name: string;
  currentQuantity: number;
  minimumThreshold: number;
  isLowStock: boolean;
  category: string;
  description: string;
  manufacturer: string;
  compatibleModels: string[];
  unitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
