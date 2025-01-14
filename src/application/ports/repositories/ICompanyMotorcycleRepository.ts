import { CompanyMotorcycle } from '@domain/entities/CompanyMotorcycleEntity';

export interface ICompanyMotorcycleRepository {
    create(companyMotorcycle: CompanyMotorcycle): Promise<void>;
    update(companyMotorcycle: CompanyMotorcycle): Promise<void>;
    findById(id: string): Promise<CompanyMotorcycle | null>;
    findByCompanyId(companyId: string): Promise<CompanyMotorcycle[]>;
    findByMotorcycleId(motorcycleId: string): Promise<CompanyMotorcycle[]>;
    findActiveByCompanyId(companyId: string): Promise<CompanyMotorcycle[]>;
    findActiveByMotorcycleId(motorcycleId: string): Promise<CompanyMotorcycle | null>;
    findAll(): Promise<CompanyMotorcycle[]>;
    exists(companyId: string, motorcycleId: string): Promise<boolean>;
}