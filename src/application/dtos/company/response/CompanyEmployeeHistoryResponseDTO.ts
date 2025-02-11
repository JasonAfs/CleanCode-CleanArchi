import { UserResponseDTO } from '../../user/response/UserResponseDTO';

export interface CompanyEmployeeHistoryResponseDTO {
  companyId: string;
  companyName: string;
  employees: UserResponseDTO[];
  activeEmployeesCount: number;
  totalEmployeesCount: number;
}
