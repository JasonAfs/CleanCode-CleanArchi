import { create } from 'zustand';
import { Dealership } from '@/types/dealership';
import { HttpDealershipService } from '@/services/dealership/HttpDealershipService';
import { Motorcycle } from '@/types/motorcycle';
import { Employee } from '@/types/employee';

interface DealershipStore {
  dealerships: Dealership[];
  currentDealershipMotorcycles: Motorcycle[];
  currentDealershipEmployees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchDealerships: () => Promise<void>;
  addDealership: (dealership: Omit<Dealership, 'id'>) => Promise<void>;
  updateDealership: (dealership: Dealership) => Promise<void>;
  deleteDealership: (id: string) => Promise<void>;
  fetchDealershipMotorcycles: (
    dealershipId: string,
    params?: {
      statusFilter?: string;
      includeInactive?: boolean;
    },
  ) => Promise<void>;
  fetchDealershipEmployees: (
    dealershipId: string,
    params?: {
      roleFilter?: string;
      includeInactive?: boolean;
    },
  ) => Promise<void>;
  currentDealership: Dealership | null;
  fetchDealershipById: (id: string) => Promise<void>;
}

export const useDealershipStore = create<DealershipStore>((set, get) => {
  const dealershipService = new HttpDealershipService();

  return {
    dealerships: [],
    currentDealershipMotorcycles: [],
    currentDealershipEmployees: [],
    isLoading: false,
    error: null,
    currentDealership: null,

    fetchDealerships: async () => {
      if (get().isLoading) return;
      set({ isLoading: true, error: null });
      try {
        const dealerships = await dealershipService.fetchDealerships();
        set({ dealerships });
      } catch (error) {
        let errorMessage =
          'Une erreur est survenue lors du chargement des concessions';
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          } else {
            errorMessage = error.message;
          }
        }
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    addDealership: async (dealershipData) => {
      set({ isLoading: true, error: null });
      try {
        await dealershipService.createDealership(dealershipData);
        const dealerships = await dealershipService.fetchDealerships();
        set({ dealerships });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec de l'ajout de la concession";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateDealership: async (dealership) => {
      set({ isLoading: true, error: null });
      try {
        const { id, ...dealershipData } = dealership;
        await dealershipService.updateDealership(id, dealershipData);
        const dealerships = await dealershipService.fetchDealerships();
        set({ dealerships });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec de la mise à jour de la concession';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteDealership: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await dealershipService.deleteDealership(id);
        const dealerships = await dealershipService.fetchDealerships();
        set({ dealerships });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec de la suppression de la concession';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchDealershipMotorcycles: async (
      dealershipId: string,
      params?: {
        statusFilter?: string;
        includeInactive?: boolean;
      },
    ) => {
      set({ isLoading: true, error: null });
      try {
        const motorcycles = await dealershipService.getDealershipMotorcycles(
          dealershipId,
          params,
        );
        set({ currentDealershipMotorcycles: motorcycles });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec du chargement des motos';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchDealershipEmployees: async (dealershipId, params) => {
      set({ isLoading: true, error: null });
      try {
        const employees = await dealershipService.getDealershipEmployees(
          dealershipId,
          params,
        );
        set({ currentDealershipEmployees: employees });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec du chargement des employés';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchDealershipById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const dealership = await dealershipService.getDealershipById(id);
        set({ currentDealership: dealership });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec du chargement des détails de la concession';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
