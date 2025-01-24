import { create } from 'zustand';
import { Company, mockCompanies } from '@/types/company';

interface CompanyStore {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: mockCompanies,
  
  addCompany: (companyData) => set((state) => ({
    companies: [
      ...state.companies,
      {
        ...companyData,
        id: crypto.randomUUID() // Générer un ID unique
      }
    ]
  })),

  updateCompany: (updatedCompany) => set((state) => ({
    companies: state.companies.map((company) =>
      company.id === updatedCompany.id ? updatedCompany : company
    )
  })),

  deleteCompany: (id) => set((state) => ({
    companies: state.companies.filter((company) => company.id !== id)
  }))
}));