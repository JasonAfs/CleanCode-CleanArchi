import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

export interface SparePartStock {
  reference: string;
  name: string;
  currentQuantity: number;
  minimumThreshold: number;
  isLowStock: boolean;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: string[];
  unitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SparePartOrder {
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

export class HttpSparePartOrderService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async getDealershipStock(): Promise<SparePartStock[]> {
    try {
      const { data } = await this.httpClient.get<SparePartStock[]>(
        `/dealerships/spare-parts/stock`,
      );
      return data;
    } catch (error) {
      console.error('Error fetching dealership stock:', error);
      throw error;
    }
  }

  async createOrder(order: {
    items: Array<{ sparePartReference: string; quantity: number }>;
    estimatedDeliveryDate?: Date;
  }): Promise<{ orderId: string }> {
    try {
      const { data } = await this.httpClient.post<{ orderId: string }>(
        `/dealerships/spare-parts/orders`,
        order,
      );
      return data;
    } catch (error) {
      console.error('Error creating spare part order:', error);
      throw error;
    }
  }

  async getOrderHistory(): Promise<SparePartOrder[]> {
    try {
      const { data } = await this.httpClient.get<SparePartOrder[]>(
        `/dealerships/spare-parts/orders`,
      );
      return data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }

  async validateOrder(
    orderId: string,
    action: 'CONFIRM' | 'CANCEL',
  ): Promise<{
    success: boolean;
    message: string;
    newStatus: OrderStatus;
    updatedStock?: Array<{ sparePartReference: string; newQuantity: number }>;
  }> {
    try {
      const { data } = await this.httpClient.post<{
        success: boolean;
        message: string;
        newStatus: OrderStatus;
        updatedStock?: Array<{
          sparePartReference: string;
          newQuantity: number;
        }>;
      }>(`/dealerships/spare-parts/validate`, {
        orderId,
        action,
      });
      return data;
    } catch (error) {
      console.error('Error validating spare part order:', error);
      throw error;
    }
  }
}
