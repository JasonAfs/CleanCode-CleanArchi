// src/store/dealershipStore.ts
import { create } from 'zustand';
import { Dealership } from '@/types/dealership';
import { HttpDealershipService } from '@/services/dealership/HttpDealershipService';

interface DealershipStore {
    dealerships: Dealership[];
    isLoading: boolean;
    error: string | null;
    fetchDealerships: () => Promise<void>;
    addDealership: (dealership: Omit<Dealership, 'id'>) => Promise<void>;
    updateDealership: (dealership: Dealership) => Promise<void>;
    deleteDealership: (id: string) => Promise<void>;
}

export const useDealershipStore = create<DealershipStore>((set, get) => {
    const dealershipService = new HttpDealershipService();

    return {
        dealerships: [],
        isLoading: false,
        error: null,

        fetchDealerships: async () => {
            if (get().isLoading) return;
            
            set({ isLoading: true, error: null });
            try {
                const dealerships = await dealershipService.fetchDealerships();
                console.log(dealerships)
                set({ dealerships });
            } catch (error) {
                let errorMessage = 'Une erreur est survenue lors du chargement des concessions';
                if (error instanceof Error) {
                    // Si c'est une erreur 401, le message est plus spécifique
                    if (error.message.includes('401')) {
                        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                        // Rediriger vers la page de connexion si nécessaire
                        // window.location.href = '/login';
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
                // Recharger la liste après l'ajout
                const dealerships = await dealershipService.fetchDealerships();
                set({ dealerships });
            } catch (error) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'Échec de l\'ajout de la concession';
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
                // Recharger la liste après la mise à jour
                const dealerships = await dealershipService.fetchDealerships();
                set({ dealerships });
            } catch (error) {
                const errorMessage = error instanceof Error 
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
                // Recharger la liste après la suppression
                const dealerships = await dealershipService.fetchDealerships();
                set({ dealerships });
            } catch (error) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : 'Échec de la suppression de la concession';
                set({ error: errorMessage });
                throw error;
            } finally {
                set({ isLoading: false });
            }
        }
    };
});