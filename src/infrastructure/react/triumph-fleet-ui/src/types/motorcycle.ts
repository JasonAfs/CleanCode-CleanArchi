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
  registrationNumber: string;
  model: {
    type: string;
    year: number;
    category: string;
  };
  mileage: number;
  dealershipId: string;
  companyId?: string;
  status: MotorcycleStatus;
  isActive: boolean;
  color: string;
  holder: MotorcycleHolder;
  createdAt: Date;
  updatedAt: Date;
}
