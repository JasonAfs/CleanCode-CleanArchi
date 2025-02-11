export interface AddDealershipEmployeeResponseDTO {
  success: boolean;
  message: string;
  dealershipId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}
