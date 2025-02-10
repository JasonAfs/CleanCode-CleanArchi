import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export interface CreateSparePartDTO extends BaseAuthenticatedDTO {
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: MotorcycleModel[];
  minimumThreshold: number;
  unitPrice: number;
}
