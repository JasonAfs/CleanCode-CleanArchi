import { WarrantyType } from '@domain/enums/MaintenanceEnums';

export interface IWarrantyProps {
  id: string;
  type: WarrantyType;
  startDate: Date;
  endDate: Date;
  mileageLimit?: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
