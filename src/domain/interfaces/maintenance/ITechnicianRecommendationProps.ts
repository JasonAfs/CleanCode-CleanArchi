import { RecommendationPriority } from '@domain/enums/MaintenanceEnums';

export interface ITechnicianRecommendationProps {
  id: string;
  description: string;
  priority: RecommendationPriority;
  technicianId: string;
  createdAt: Date;
  updatedAt: Date;
}
