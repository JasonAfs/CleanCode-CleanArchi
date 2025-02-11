import { SparePart } from '@domain/value-objects/SparePart';

export interface UsedSparePart {
  sparePart: SparePart;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  usedAt: Date;
}
