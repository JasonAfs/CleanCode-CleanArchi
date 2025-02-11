import { SparePart } from '@domain/value-objects/SparePart';
import { SparePartOrder } from '@domain/entities/SparePartOrderEntity';
import { DealershipSparePartsStockError } from '@domain/errors/spare-part/DealershipSparePartsStockError';

export class DealershipSparePartsStock {
  private constructor(
    private readonly dealershipId: string,
    private readonly stock: Map<string, number>,
    private readonly thresholds: Map<string, number>,
    private readonly orders: SparePartOrder[],
  ) {}

  public static create(dealershipId: string): DealershipSparePartsStock {
    return new DealershipSparePartsStock(
      dealershipId,
      new Map<string, number>(),
      new Map<string, number>(),
      [],
    );
  }

  public addStock(sparePart: SparePart, quantity: number): void {
    const currentQuantity = this.stock.get(sparePart.sparePartReference) || 0;
    this.stock.set(sparePart.sparePartReference, currentQuantity + quantity);
  }

  public removeStock(sparePart: SparePart, quantity: number): void {
    const currentQuantity = this.stock.get(sparePart.sparePartReference) || 0;
    if (currentQuantity < quantity) {
      throw new DealershipSparePartsStockError('Insufficient stock');
    }
    this.stock.set(sparePart.sparePartReference, currentQuantity - quantity);
  }

  public setThreshold(sparePart: SparePart, threshold: number): void {
    this.thresholds.set(sparePart.sparePartReference, threshold);
  }

  public isStockLow(sparePartReference: string): boolean {
    const currentQuantity = this.stock.get(sparePartReference) || 0;
    const threshold = this.thresholds.get(sparePartReference);
    return threshold !== undefined && currentQuantity <= threshold;
  }

  public getLowStockParts(): string[] {
    return Array.from(this.stock.entries())
      .filter(([reference]) => this.isStockLow(reference))
      .map(([reference]) => reference);
  }

  public addOrder(order: SparePartOrder): void {
    this.orders.push(order);
  }

  public getOrderHistory(): SparePartOrder[] {
    return [...this.orders];
  }

  public getStock(sparePartReference: string): number {
    return this.stock.get(sparePartReference) || 0;
  }

  public getStockEntries(): Array<[string, number]> {
    return Array.from(this.stock.entries());
  }

  public getMinimumThreshold(reference: string): number {
    return this.thresholds.get(reference) || 0;
  }
}
