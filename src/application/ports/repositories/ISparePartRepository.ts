import { SparePart } from '@domain/value-objects/SparePart';
import { SparePartCategory } from '@domain/value-objects/SparePart';

interface SparePartFilters {
  category?: SparePartCategory;
  manufacturer?: string;
  compatibleModel?: string;
}

export interface ISparePartRepository {
  create(sparePart: SparePart): Promise<void>;
  update(sparePart: SparePart): Promise<void>;
  findById(id: string): Promise<SparePart | null>;
  findByReference(reference: string): Promise<SparePart | null>;
  findAll(filters?: SparePartFilters): Promise<SparePart[]>;

  // Recherches spécifiques
  findByCategory(category: SparePartCategory): Promise<SparePart[]>;
  findByManufacturer(manufacturer: string): Promise<SparePart[]>;
  findByCompatibleModel(modelId: string): Promise<SparePart[]>;

  // Vérifications
  exists(reference: string): Promise<boolean>;

  delete(reference: string): Promise<void>;
}
