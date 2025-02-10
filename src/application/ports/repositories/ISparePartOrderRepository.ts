import {
  SparePartOrder,
  OrderStatus,
} from '@domain/entities/SparePartOrderEntity';

export interface ISparePartOrderRepository {
  create(order: SparePartOrder): Promise<void>;
  update(order: SparePartOrder): Promise<void>;
  findById(id: string): Promise<SparePartOrder | null>;

  // Recherches spécifiques
  findByDealershipId(dealershipId: string): Promise<SparePartOrder[]>;
  findByStatus(status: OrderStatus): Promise<SparePartOrder[]>;
  findPendingOrders(dealershipId: string): Promise<SparePartOrder[]>;
  findPendingOrders(): Promise<SparePartOrder[]>;

  // Recherches par date
  findByDateRange(
    dealershipId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<SparePartOrder[]>;

  // Statistiques
  getOrderStats(dealershipId: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalAmount: number;
    averageDeliveryTime: number;
  }>;
}
