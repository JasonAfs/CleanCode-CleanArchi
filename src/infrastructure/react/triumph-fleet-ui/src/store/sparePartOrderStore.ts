import { create } from 'zustand';
import {
  HttpSparePartOrderService,
  SparePartStock,
  SparePartOrder,
} from '../services/sparePart/HttpSparePartOrderService';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

interface SparePartOrderState {
  stock: SparePartStock[];
  orders: SparePartOrder[];
  isLoading: boolean;
  error: string | null;
  service: HttpSparePartOrderService;

  // Actions
  fetchStock: () => Promise<void>;
  createOrder: (order: {
    items: Array<{ sparePartReference: string; quantity: number }>;
    estimatedDeliveryDate?: Date;
  }) => Promise<string>;
  fetchOrderHistory: () => Promise<void>;
  clearError: () => void;
  setError: (message: string | null) => void;
  validateOrder: (
    orderId: string,
    action: 'CONFIRM' | 'CANCEL',
  ) => Promise<{
    success: boolean;
    message: string;
    newStatus: OrderStatus;
    updatedStock?: Array<{ sparePartReference: string; newQuantity: number }>;
  }>;
}

export const useSparePartOrderStore = create<SparePartOrderState>(
  (set, get) => ({
    stock: [],
    orders: [],
    isLoading: false,
    error: null,
    service: new HttpSparePartOrderService(),

    fetchStock: async () => {
      set({ isLoading: true, error: null });
      try {
        const stock = await get().service.getDealershipStock();
        set({ stock, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Une erreur est survenue',
          isLoading: false,
        });
      }
    },

    createOrder: async (order) => {
      set({ isLoading: true, error: null });
      try {
        const result = await get().service.createOrder(order);
        await get().fetchOrderHistory();
        await get().fetchStock();
        return result.orderId;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Une erreur est survenue';
        set({
          error: errorMessage,
          isLoading: false,
        });
        throw error;
      }
    },

    fetchOrderHistory: async () => {
      set({ isLoading: true, error: null });
      try {
        const orders = await get().service.getOrderHistory();
        set({ orders, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : 'Une erreur est survenue',
          isLoading: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    setError: (message: string | null) => set({ error: message }),

    validateOrder: async (orderId, action) => {
      set({ isLoading: true, error: null });
      try {
        const result = await get().service.validateOrder(orderId, action);
        await get().fetchOrderHistory();
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Une erreur est survenue';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },
  }),
);
