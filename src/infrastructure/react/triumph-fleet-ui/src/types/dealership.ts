export interface Dealership {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactInfo: {
    phoneNumber: string;
    email: string;
  };
  isActive: boolean;
}

export type DealershipDialogState = {
  isOpen: boolean;
  toggleModal: () => void;
  data: Dealership | null;
  setData: (dealership: Dealership) => void;
};
