import { DealershipEmployeeResponseDTO } from './DealershipEmployeeResponseDTO';

export interface DealershipWithEmployeesDTO {
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
  employees: DealershipEmployeeResponseDTO[];
  isActive: boolean;
}
