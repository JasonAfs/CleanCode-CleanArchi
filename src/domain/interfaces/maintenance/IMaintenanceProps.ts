import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';
import { SparePart } from '@domain/value-objects/SparePart';
import { MaintenanceCost } from '@domain/value-objects/MaintenanceCost';
import { TechnicianRecommendation } from '@domain/value-objects/TechnicianRecommendation';
import { Warranty } from '@domain/value-objects/Warranty';

interface UsedSparePart {
  sparePart: SparePart;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  usedAt: Date;
}

export interface IMaintenanceProps {
  id: string;
  motorcycleId: string;
  dealershipId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  mileage: number;
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  spareParts: SparePart[];
  usedSpareParts: UsedSparePart[];
  costs?: MaintenanceCost;
  recommendations: TechnicianRecommendation[];
  warranty?: Warranty;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaintenanceProps {
  motorcycleId: string;
  dealershipId: string;
  type: MaintenanceType;
  description: string;
  mileage: number;
  scheduledDate: Date;
}

export interface ReconstituteMaintenanceProps extends IMaintenanceProps {}
