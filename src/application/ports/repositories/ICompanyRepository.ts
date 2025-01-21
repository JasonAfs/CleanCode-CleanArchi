import { Company } from '@domain/entities/CompanyEntity';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';

export interface ICompanyRepository {
    create(company: Company): Promise<void>;
    update(company: Company): Promise<void>;
    findById(id: string): Promise<Company | null>;
    findByRegistrationNumber(registrationNumber: RegistrationNumber): Promise<Company | null>;
    findByEmployeeId(userId: string): Promise<Company | null>;
    findAll(): Promise<Company[]>;
    findActive(): Promise<Company[]>;
    exists(registrationNumber: RegistrationNumber): Promise<boolean>;
    findByDealershipId(dealershipId: string): Promise<Company[]>;
}