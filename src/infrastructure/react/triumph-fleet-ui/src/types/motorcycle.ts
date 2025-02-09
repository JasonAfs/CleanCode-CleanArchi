import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';

export interface MotorcycleModel {
  type: string;
  year: number;
  displacement: number;
  category: string;
  maintenanceInterval: number;
}

export interface MotorcycleHolder {
  dealershipId: string;
  companyId?: string;
  assignedAt: Date;
}

export interface Motorcycle {
  id: string;
  vin: string;
  model: MotorcycleModel;
  color: string;
  mileage: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
  holder: MotorcycleHolder;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
