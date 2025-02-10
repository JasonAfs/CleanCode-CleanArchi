import { DealershipSparePartsStock } from '@domain/aggregates/dealership/DealershipSparePartsStock';
import { SparePart } from '@domain/value-objects/SparePart';

export interface ISparePartStockRepository {
  // Opérations de base
  findByDealershipId(dealershipId: string): Promise<DealershipSparePartsStock>;
  updateStock(
    dealershipId: string,
    stock: DealershipSparePartsStock,
  ): Promise<void>;

  // Gestion du stock
  addStock(
    dealershipId: string,
    sparePart: SparePart,
    quantity: number,
  ): Promise<void>;
  removeStock(
    dealershipId: string,
    sparePart: SparePart,
    quantity: number,
  ): Promise<void>;

  // Recherches spécifiques
  findLowStock(
    dealershipId: string,
  ): Promise<Array<{ sparePart: SparePart; quantity: number }>>;
  findOutOfStock(dealershipId: string): Promise<SparePart[]>;

  // Historique
  getStockHistory(
    dealershipId: string,
    sparePartReference: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      date: Date;
      quantity: number;
      type: 'IN' | 'OUT';
      reason: string;
    }>
  >;
}
