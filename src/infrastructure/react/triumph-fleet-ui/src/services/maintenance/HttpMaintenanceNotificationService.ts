import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { MaintenanceNotification } from '@/types/maintenanceNotification';

interface GetNotificationsParams {
  includeRead?: boolean;
}

export class HttpMaintenanceNotificationService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async getNotifications(
    params?: GetNotificationsParams,
  ): Promise<MaintenanceNotification[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.includeRead !== undefined) {
        queryParams.append('includeRead', params.includeRead.toString());
      }

      const url = `/maintenance-notifications${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const { data } =
        await this.httpClient.get<MaintenanceNotification[]>(url);
      return data;
    } catch (error) {
      console.error('Error fetching maintenance notifications:', error);
      throw error;
    }
  }
}
