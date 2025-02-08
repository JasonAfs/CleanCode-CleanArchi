// src/store/companyStore.ts
import { create } from 'zustand';
import { Company } from '@/types/company';
import { HttpCompanyService } from '@/services/company/HttpCompanyService';

interface CompanyStore {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  updateCompany: (company: Company) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  currentCompany: Company | null;
  fetchCompanyById: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => {
  const companyService = new HttpCompanyService();

  return {
    companies: [],
    isLoading: false,
    error: null,
    currentCompany: null,

    fetchCompanies: async () => {
      if (get().isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const companies = await companyService.fetchCompanies();
        set({ companies });
      } catch (error) {
        let errorMessage =
          'Une erreur est survenue lors du chargement des entreprises';
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

    addCompany: async (companyData) => {
      set({ isLoading: true, error: null });
      try {
        await companyService.createCompany(companyData);
        const companies = await companyService.fetchCompanies();
        set({ companies });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec de l'ajout de l'entreprise";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateCompany: async (company) => {
      set({ isLoading: true, error: null });
      try {
        const { id, ...companyData } = company;
        await companyService.updateCompany(id, companyData);
        const companies = await companyService.fetchCompanies();
        set({ companies });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec de la mise à jour de l'entreprise";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteCompany: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await companyService.deleteCompany(id);
        const companies = await companyService.fetchCompanies();
        set({ companies });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec de la suppression de l'entreprise";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchCompanyById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const company = await companyService.getCompanyById(id);
        set({ currentCompany: company });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Échec du chargement des détails de l'entreprise";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
