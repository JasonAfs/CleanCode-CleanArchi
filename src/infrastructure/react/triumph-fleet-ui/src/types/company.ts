export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
  };
  contactInfo: {
      phone: string;
      email: string;
  };
  isActive: boolean;
  employees: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
  }>;
}

export type CompanyDialogState = {
  isOpen: boolean;
  toggleModal: () => void;
  data: Company | null;
  setData: (company: Company) => void;
};