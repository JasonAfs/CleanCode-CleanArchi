import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';
import { SparePart } from '@domain/value-objects/SparePart';
import { MaintenanceCost } from '@domain/value-objects/MaintenanceCost';
import { TechnicianRecommendation } from '@domain/value-objects/TechnicianRecommendation';

export interface MaintenanceResponseDTO {
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
  costs?: MaintenanceCost;
  recommendations: TechnicianRecommendation[];
  createdAt: Date;
  updatedAt: Date;
}
