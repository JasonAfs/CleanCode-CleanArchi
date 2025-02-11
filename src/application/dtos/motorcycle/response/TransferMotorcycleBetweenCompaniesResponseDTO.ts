export interface TransferMotorcycleBetweenCompaniesResponseDTO {
  success: boolean;
  message: string;
  motorcycleId: string;
  previousCompanyId: string;
  newCompanyId: string;
  dealershipId: string;
}
