import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import {
  MaintenanceStatus,
  MaintenanceType,
} from '@domain/enums/MaintenanceEnums';
import { Maintenance } from '@/store/maintenanceStore';

interface GetMaintenancesParams {
  startDate?: Date;
  endDate?: Date;
  status?: MaintenanceStatus | 'ALL';
  type?: MaintenanceType | 'ALL';
  dealershipId?: string;
  companyId?: string;
}

export class HttpMaintenanceService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async getMaintenances(
    params?: GetMaintenancesParams,
  ): Promise<Maintenance[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.startDate) {
        queryParams.append('startDate', params.startDate.toISOString());
      }
      if (params?.endDate) {
        queryParams.append('endDate', params.endDate.toISOString());
      }
      if (params?.status && params.status !== 'ALL') {
        queryParams.append('status', params.status);
      }
      if (params?.type && params.type !== 'ALL') {
        queryParams.append('type', params.type);
      }
      if (params?.dealershipId) {
        queryParams.append('dealershipId', params.dealershipId);
      }
      if (params?.companyId) {
        queryParams.append('companyId', params.companyId);
      }

      const url = `/maintenances${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const { data } = await this.httpClient.get<Maintenance[]>(url);
      return data;
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      throw error;
    }
  }

  async getMaintenanceDetails(maintenanceId: string): Promise<Maintenance> {
    try {
      const { data } = await this.httpClient.get<Maintenance>(
        `/maintenances/${maintenanceId}`,
      );
      return data;
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      throw error;
    }
  }
}
