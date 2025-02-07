import { create } from 'zustand';
import { HttpMotorcycleService } from '@/services/motorcycle/HttpMotorcycleService';
import { TransferMotorcycleResponse } from '@/types/responses';

interface Motorcycle {
  id: string;
  vin: string;
  registrationNumber: string;
  model: string;
  mileage: number;
  dealershipId: string;
  companyId?: string;
}

interface MotorcycleStore {
  motorcycles: Motorcycle[];
  isLoading: boolean;
  error: string | null;

  fetchMotorcycles: () => Promise<void>;
  createMotorcycle: (
    motorcycle: Omit<Motorcycle, 'id' | 'companyId'>,
  ) => Promise<void>;
  updateMotorcycle: (
    id: string,
    motorcycle: Partial<Omit<Motorcycle, 'id' | 'dealershipId' | 'companyId'>>,
  ) => Promise<void>;
  updateMotorcycleMileage: (id: string, mileage: number) => Promise<void>;
  transferMotorcycle: (
    id: string,
    dealershipId: string,
  ) => Promise<TransferMotorcycleResponse>;
  assignMotorcycleToCompany: (id: string, companyId: string) => Promise<void>;
  releaseMotorcycleFromCompany: (motorcycleId: string) => Promise<void>;
  transferMotorcycleBetweenCompanies: (
    id: string,
    targetCompanyId: string,
  ) => Promise<void>;
}

export const useMotorcycleStore = create<MotorcycleStore>((set, get) => {
  const motorcycleService = new HttpMotorcycleService();

  return {
    motorcycles: [],
    isLoading: false,
    error: null,

    fetchMotorcycles: async () => {
      if (get().isLoading) return;
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/motorcycles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const motorcycles = await response.json();
        set({ motorcycles });
      } catch (error) {
        let errorMessage =
          'Une erreur est survenue lors du chargement des motos';
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

    createMotorcycle: async (motorcycleData) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.createMotorcycle(motorcycleData);
        await get().fetchMotorcycles();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec de la création de la moto';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateMotorcycle: async (id, motorcycleData) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.updateMotorcycle(id, motorcycleData);
        await get().fetchMotorcycles();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec de la mise à jour de la moto';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateMotorcycleMileage: async (id, mileage) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.updateMotorcycleMileage(id, mileage);
        await get().fetchMotorcycles();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec de la mise à jour du kilométrage';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    transferMotorcycle: async (id: string, dealershipId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await motorcycleService.transferMotorcycle(
          id,
          dealershipId,
        );
        await get().fetchMotorcycles();
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec du transfert de la moto';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    assignMotorcycleToCompany: async (id, companyId) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.assignMotorcycleToCompany(id, companyId);
        await get().fetchMotorcycles();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec de l'attribution de la moto à l'entreprise";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    releaseMotorcycleFromCompany: async (motorcycleId: string) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.releaseFromCompany(motorcycleId);
        await get().fetchMotorcycles();
      } catch (error) {
        console.error('Error releasing motorcycle:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    transferMotorcycleBetweenCompanies: async (id, targetCompanyId) => {
      set({ isLoading: true, error: null });
      try {
        await motorcycleService.transferMotorcycleBetweenCompanies(
          id,
          targetCompanyId,
        );
        await get().fetchMotorcycles();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Échec du transfert de la moto entre entreprises';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
