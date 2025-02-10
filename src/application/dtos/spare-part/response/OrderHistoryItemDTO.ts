import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

export interface OrderHistoryItemDTO {
  orderId: string;
  orderDate: Date;
  status: OrderStatus;
  items: Array<{
    reference: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  estimatedDeliveryDate?: Date;
  deliveredAt?: Date;
}
