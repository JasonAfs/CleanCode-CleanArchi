import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { Dealership } from '@/types/dealership';

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
                email: dealership.contactInfo.email
            };
            
            await this.httpClient.post('/dealerships', payload);
        } catch (error) {
            console.error('Error creating dealership:', error);
            throw error;
        }
    }

    async updateDealership(id: string, dealership: Omit<Dealership, 'id'>): Promise<void> {
        try {
            const payload = {
                name: dealership.name,
                street: dealership.address.street,
                city: dealership.address.city,
                postalCode: dealership.address.postalCode,
                country: dealership.address.country,
                phone: dealership.contactInfo.phoneNumber,
                email: dealership.contactInfo.email
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
}