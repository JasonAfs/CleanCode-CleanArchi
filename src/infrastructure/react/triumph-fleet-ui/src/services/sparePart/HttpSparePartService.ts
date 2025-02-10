import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';
import { UserRole } from '@domain/enums/UserRole';

export interface SparePart {
  id: string;
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: MotorcycleModel[];
  minimumThreshold: number;
  unitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GetSparePartsParams {
  category?: SparePartCategory;
  manufacturer?: string;
  compatibleModel?: MotorcycleModel;
  userRole?: UserRole;
}

interface CreateSparePartParams {
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: MotorcycleModel[];
  minimumThreshold: number;
  unitPrice: number;
  userRole: UserRole;
}

interface UpdateSparePartParams {
  name?: string;
  category?: SparePartCategory;
  description?: string;
  manufacturer?: string;
  compatibleModels?: MotorcycleModel[];
  minimumThreshold?: number;
  unitPrice?: number;
  userRole: UserRole;
}

export class HttpSparePartService extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.httpClient.setAuthorizationHeader(token);
    }
  }

  async getSpareParts(params?: GetSparePartsParams): Promise<SparePart[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.category) {
        queryParams.append('category', params.category);
      }
      if (params?.manufacturer) {
        queryParams.append('manufacturer', params.manufacturer);
      }
      if (params?.compatibleModel) {
        queryParams.append('compatibleModel', params.compatibleModel);
      }

      const url = `/spare-parts${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const { data } = await this.httpClient.get<SparePart[]>(url);
      return data;
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      throw error;
    }
  }

  async getSparePartByReference(reference: string): Promise<SparePart> {
    try {
      const { data } = await this.httpClient.get<SparePart>(
        `/spare-parts/${reference}`,
      );
      return data;
    } catch (error) {
      console.error('Error fetching spare part details:', error);
      throw error;
    }
  }

  async createSparePart(params: CreateSparePartParams): Promise<SparePart> {
    try {
      const { data } = await this.httpClient.post<SparePart>(
        '/spare-parts',
        params,
      );
      return data;
    } catch (error) {
      console.error('Error creating spare part:', error);
      throw error;
    }
  }

  async updateSparePart(
    reference: string,
    params: UpdateSparePartParams,
  ): Promise<SparePart> {
    try {
      const { data } = await this.httpClient.put<SparePart>(
        `/spare-parts/${reference}`,
        params,
      );
      return data;
    } catch (error) {
      console.error('Error updating spare part:', error);
      throw error;
    }
  }

  async deleteSparePart(reference: string, userRole: UserRole): Promise<void> {
    try {
      await this.httpClient.delete(`/spare-parts/${reference}`, {
        data: { userRole },
      });
    } catch (error) {
      console.error('Error deleting spare part:', error);
      throw error;
    }
  }
}
