import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';

export interface IMotorcycleProps {
  id: string;
  vin: string; // Vehicle Identification Number
  dealershipId: string; // La concession propriétaire
  model: string;
  year: number;
  registrationNumber: string;
  status: MotorcycleStatus;
  mileage: number;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
