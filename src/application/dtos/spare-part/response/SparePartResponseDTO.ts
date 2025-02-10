import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export interface SparePartResponseDTO {
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: MotorcycleModel[];
  minimumThreshold: number;
  unitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
