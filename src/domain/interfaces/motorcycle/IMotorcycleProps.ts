import { Model } from '@domain/value-objects/Model';
import { VIN } from '@domain/value-objects/VIN';
import {
  MotorcycleStatus,
  MotorcycleModel,
} from '@domain/enums/MotorcycleEnums';
import { MotorcycleHolder } from './MotorcycleHolder';
import { MotorcycleMaintenance } from '@domain/aggregates/motorcycle/MotorcycleMaintenance';

export interface MotorcycleProps {
  id: string;
  vin: VIN;
  model: Model;
  color: string;
  mileage: number;
  status: MotorcycleStatus;
  holder?: MotorcycleHolder;
  maintenance: MotorcycleMaintenance;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMotorcycleProps {
  vin: VIN;
  model: Model;
  color: string;
  mileage: number;
  dealershipId: string;
}

export interface ReconstituteMotorcycleProps extends CreateMotorcycleProps {
  id: string;
  status: MotorcycleStatus;
  holder?: MotorcycleHolder;
  maintenance: MotorcycleMaintenance;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
