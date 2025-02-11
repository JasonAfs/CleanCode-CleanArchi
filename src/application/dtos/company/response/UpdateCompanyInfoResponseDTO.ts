export interface UpdateCompanyInfoResponseDTO {
  success: boolean;
  message: string;
  companyId: string;
  updatedFields: {
    name?: boolean;
    address?: boolean;
    contactInfo?: boolean;
  };
}
