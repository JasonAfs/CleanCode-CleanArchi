export interface UpdateDealershipInfoResponseDTO {
  success: boolean;
  message: string;
  dealershipId: string;
  updatedFields: {
    name?: boolean;
    address?: boolean;
    contactInfo?: boolean;
  };
}
