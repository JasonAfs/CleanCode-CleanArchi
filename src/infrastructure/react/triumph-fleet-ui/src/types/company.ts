export interface Company {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
  }
  
  export type CompanyDialogState = {
    isOpen: boolean;
    toggleModal: () => void;
    data: Company | null;
    setData: (company: Company) => void;
  }
  
  // Mock data
  export const mockCompanies: Company[] = [
    {
      id: "1",
      name: "Auto École Paris",
      email: "contact@autoecole-paris.fr",
      status: "active"
    },
    {
      id: "2",
      name: "Moto Location Lyon",
      email: "info@motolocation-lyon.fr",
      status: "active"
    },
    {
      id: "3",
      name: "Coursiers Express",
      email: "contact@coursiers-express.fr",
      status: "inactive"
    }
  ];