import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { Company } from '@/types/company';
import { Employee } from '@/types/employee';
import { UserRole } from '@domain/enums/UserRole';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { Motorcycle } from '@/types/motorcycle';

export class HttpCompanyService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async fetchCompanies(): Promise<Company[]> {
    try {
      const response = await this.httpClient.get<Company[]>('/companies');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<void> {
    try {
      const payload = {
        name: company.name,
        registrationNumber: company.registrationNumber,
        street: company.address.street,
        city: company.address.city,
        postalCode: company.address.postalCode,
        country: company.address.country,
        phone: company.contactInfo.phone,
        email: company.contactInfo.email,
      };

      await this.httpClient.post('/companies', payload);
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async updateCompany(id: string, company: Omit<Company, 'id'>): Promise<void> {
    try {
      const payload = {
        name: company.name,
        street: company.address.street,
        city: company.address.city,
        postalCode: company.address.postalCode,
        country: company.address.country,
        phone: company.contactInfo.phone,
        email: company.contactInfo.email,
      };

      await this.httpClient.put(`/companies/${id}`, payload);
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/companies/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  async getCompanyEmployees(companyId: string): Promise<Employee[]> {
    try {
      const response = await this.httpClient.get<Employee[]>(
        `/companies/${companyId}/employees`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching company employees:', error);
      throw error;
    }
  }

  async addCompanyEmployee(
    companyId: string,
    employeeData: {
      employeeId: string;
      role: UserRole;
    },
  ): Promise<void> {
    try {
      await this.httpClient.post(
        `/companies/${companyId}/employees`,
        employeeData,
      );
    } catch (error) {
      console.error('Error adding company employee:', error);
      throw error;
    }
  }

  async removeCompanyEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<void> {
    try {
      await this.httpClient.delete(
        `/companies/${companyId}/employees/${employeeId}`,
      );
    } catch (error) {
      console.error('Error removing company employee:', error);
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<Company> {
    try {
      const response = await this.httpClient.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  }

  async getCompanyMotorcycles(
    companyId: string,
    params?: {
      includeInactive?: boolean;
      statusFilter?: MotorcycleStatus;
    },
  ): Promise<Motorcycle[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.includeInactive !== undefined) {
        queryParams.append(
          'includeInactive',
          params.includeInactive.toString(),
        );
      }
      if (params?.statusFilter) {
        queryParams.append('statusFilter', params.statusFilter);
      }

      const url = `/companies/${companyId}/motorcycles${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await this.httpClient.get<Motorcycle[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching company motorcycles:', error);
      throw error;
    }
  }
}
