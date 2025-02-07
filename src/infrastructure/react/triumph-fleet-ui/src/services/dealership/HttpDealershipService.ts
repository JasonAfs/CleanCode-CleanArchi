import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { Dealership } from '@/types/dealership';
import { Motorcycle } from '@/types/motorcycle';
import { Employee } from '@/types/employee';

export class HttpDealershipService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async fetchDealerships(): Promise<Dealership[]> {
    try {
      const response = await this.httpClient.get<Dealership[]>('/dealerships');
      return response.data;
    } catch (error) {
      console.error('Error fetching dealerships:', error);
      throw error;
    }
  }

  async createDealership(dealership: Omit<Dealership, 'id'>): Promise<void> {
    try {
      const payload = {
        name: dealership.name,
        street: dealership.address.street,
        city: dealership.address.city,
        postalCode: dealership.address.postalCode,
        country: dealership.address.country,
        phone: dealership.contactInfo.phoneNumber,
        email: dealership.contactInfo.email,
      };

      await this.httpClient.post('/dealerships', payload);
    } catch (error) {
      console.error('Error creating dealership:', error);
      throw error;
    }
  }

  async updateDealership(
    id: string,
    dealership: Omit<Dealership, 'id'>,
  ): Promise<void> {
    try {
      const payload = {
        name: dealership.name,
        street: dealership.address.street,
        city: dealership.address.city,
        postalCode: dealership.address.postalCode,
        country: dealership.address.country,
        phone: dealership.contactInfo.phoneNumber,
        email: dealership.contactInfo.email,
      };

      await this.httpClient.put(`/dealerships/${id}`, payload);
    } catch (error) {
      console.error('Error updating dealership:', error);

      throw error;
    }
  }

  async deleteDealership(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/dealerships/${id}`);
    } catch (error) {
      console.error('Error deleting dealership:', error);
      throw error;
    }
  }

  async getDealershipMotorcycles(
    dealershipId: string,
    params?: {
      statusFilter?: string;
      includeInactive?: boolean;
    },
  ): Promise<Motorcycle[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.statusFilter) {
        queryParams.append('statusFilter', params.statusFilter);
      }
      if (params?.includeInactive !== undefined) {
        queryParams.append(
          'includeInactive',
          params.includeInactive.toString(),
        );
      }

      const url = `/dealerships/${dealershipId}/motorcycles${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await this.httpClient.get<Motorcycle[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dealership motorcycles:', error);
      throw error;
    }
  }

  async getDealershipEmployees(
    dealershipId: string,
    params?: {
      roleFilter?: string;
      includeInactive?: boolean;
    },
  ): Promise<Employee[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.roleFilter) {
        queryParams.append('roleFilter', params.roleFilter);
      }
      if (params?.includeInactive !== undefined) {
        queryParams.append(
          'includeInactive',
          params.includeInactive.toString(),
        );
      }

      const url = `/dealerships/${dealershipId}/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.httpClient.get<Employee[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dealership employees:', error);
      throw error;
    }
  }

  async getDealershipById(id: string): Promise<Dealership> {
    try {
      const response = await this.httpClient.get<Dealership>(
        `/dealerships/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails de la concession:',
        error,
      );
      throw error;
    }
  }
}
