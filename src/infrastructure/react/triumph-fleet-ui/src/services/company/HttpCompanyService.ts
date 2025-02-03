import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { Company } from '@/types/company';

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
                email: company.contactInfo.email
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
                email: company.contactInfo.email
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
}