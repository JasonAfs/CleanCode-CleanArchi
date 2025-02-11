export interface CompanyResponseDTO {
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
  registrationNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  dealershipId?: string;
}
