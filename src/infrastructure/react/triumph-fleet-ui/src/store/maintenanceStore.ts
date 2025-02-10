import { create } from 'zustand';
import { HttpMaintenanceService } from '@/services/maintenance/HttpMaintenanceService';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';

export interface Maintenance {
  id: string;
  motorcycleId: string;
  dealershipId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  mileage: number;
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  spareParts: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  costs: Array<{
    description: string;
    amount: number;
  }>;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MaintenanceStore {
  maintenances: Maintenance[];
  currentMaintenance: Maintenance | null;
  isLoading: boolean;
  error: string | null;
  fetchMaintenances: (params?: {
    startDate?: Date;
    endDate?: Date;
    status?: MaintenanceStatus | 'ALL';
    type?: MaintenanceType | 'ALL';
    dealershipId?: string;
    companyId?: string;
  }) => Promise<void>;
  fetchMaintenanceDetails: (maintenanceId: string) => Promise<void>;
}

const maintenanceService = new HttpMaintenanceService();

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  maintenances: [],
  currentMaintenance: null,
  isLoading: false,
  error: null,

  fetchMaintenances: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const maintenances = await maintenanceService.getMaintenances(params);
      set({ maintenances });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMaintenanceDetails: async (maintenanceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const maintenance =
        await maintenanceService.getMaintenanceDetails(maintenanceId);
      set({ currentMaintenance: maintenance });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
