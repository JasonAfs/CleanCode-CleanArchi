export interface AddCompanyEmployeeResponseDTO {
  success: boolean;
  message: string;
  companyId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}
