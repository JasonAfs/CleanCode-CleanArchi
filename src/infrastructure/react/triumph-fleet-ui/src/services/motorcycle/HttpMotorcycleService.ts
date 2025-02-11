import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { TransferMotorcycleResponse } from '../../types/responses';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { Motorcycle } from '@/types/motorcycle';

interface GetMotorcyclesParams {
  statusFilter?: MotorcycleStatus;
  includeInactive?: boolean;
}

export class HttpMotorcycleService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async createMotorcycle(motorcycle: {
    model: {
      type: string;
      year: number;
      displacement: number;
      category: string;
      maintenanceInterval: number;
    };
    vin: string;
    mileage: number;
    status: 'AVAILABLE' | 'MAINTENANCE';
    holder: {
      dealershipId: string;
    };
  }) {
    console.log(motorcycle);
    return this.httpClient.post<Motorcycle>('/motorcycles', motorcycle);
  }

  async updateMotorcycle(
    id: string,
    motorcycle: {
      model: {
        type: string;
        year: number;
        displacement: number;
        category: string;
        maintenanceInterval: number;
      };
      vin: string;
      mileage: number;
      status: 'AVAILABLE' | 'MAINTENANCE';
    },
  ) {
    return this.httpClient.put<Motorcycle>(`/motorcycles/${id}`, motorcycle);
  }

  async updateMotorcycleMileage(id: string, mileage: number): Promise<void> {
    try {
      await this.httpClient.patch(`/motorcycles/${id}/mileage`, { mileage });
    } catch (error) {
      console.error('Error updating motorcycle mileage:', error);
      throw error;
    }
  }

  async transferMotorcycle(
    id: string,
    dealershipId: string,
  ): Promise<TransferMotorcycleResponse> {
    try {
      const { data } = await this.httpClient.patch<TransferMotorcycleResponse>(
        `/motorcycles/${id}/transfer`,
        {
          dealershipId,
        },
      );
      return data;
    } catch (error) {
      console.error('Error transferring motorcycle:', error);
      throw error;
    }
  }

  async assignMotorcycleToCompany(
    id: string,
    companyId: string,
  ): Promise<void> {
    try {
      await this.httpClient.patch(`/motorcycles/${id}/assign-company`, {
        companyId,
      });
    } catch (error) {
      console.error('Error assigning motorcycle to company:', error);
      throw error;
    }
  }

  async releaseMotorcycleFromCompany(id: string): Promise<void> {
    try {
      await this.httpClient.patch(`/motorcycles/${id}/release-company`, {});
    } catch (error) {
      console.error('Error releasing motorcycle from company:', error);
      throw error;
    }
  }

  async transferMotorcycleBetweenCompanies(
    id: string,
    targetCompanyId: string,
  ): Promise<void> {
    try {
      await this.httpClient.patch(`/motorcycles/${id}/transfer-company`, {
        targetCompanyId,
      });
    } catch (error) {
      console.error('Error transferring motorcycle between companies:', error);
      throw error;
    }
  }

  async releaseFromCompany(motorcycleId: string): Promise<void> {
    try {
      await this.httpClient.patch(
        `/motorcycles/${motorcycleId}/release-company`,
      );
    } catch (error) {
      console.error('Error releasing motorcycle from company:', error);
      throw error;
    }
  }

  async getMotorcycles(params?: GetMotorcyclesParams): Promise<Motorcycle[]> {
    try {
      const { data } = await this.httpClient.get<Motorcycle[]>('/motorcycles', {
        params: {
          statusFilter: params?.statusFilter,
          includeInactive: params?.includeInactive,
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching motorcycles:', error);
      throw error;
    }
  }
}
