import { UserRole } from '@domain/enums/UserRole';

export type SparePartCategory =
  | 'ENGINE'
  | 'TRANSMISSION'
  | 'BRAKES'
  | 'SUSPENSION'
  | 'ELECTRICAL'
  | 'BODY'
  | 'OTHER';

export interface SparePart {
  id: string;
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: string[];
  minimumStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSparePartDTO {
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: string[];
  minimumThreshold: number;
  userRole: UserRole;
}

export interface UpdateSparePartDTO {
  reference: string;
  name?: string;
  category?: SparePartCategory;
  description?: string;
  manufacturer?: string;
  compatibleModels?: string[];
  minimumThreshold?: number;
  userRole: UserRole;
}

export interface SparePartDialogState {
  isOpen: boolean;
  toggleModal: () => void;
  data: SparePart | null;
  setData: (data: SparePart) => void;
}
