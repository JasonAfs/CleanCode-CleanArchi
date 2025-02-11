export interface RemoveCompanyEmployeeResponseDTO {
  success: boolean;
  message: string;
  companyId: string;
  removedEmployeeId: string;
  remainingEmployeesCount: number;
}
