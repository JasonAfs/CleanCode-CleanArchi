import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { Company } from '@domain/entities/CompanyEntity';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';

export class InMemoryCompanyRepository implements ICompanyRepository {
    private companies: Map<string, Company> = new Map();

    async create(company: Company): Promise<void> {
        if (await this.exists(company.registrationNumber)) {
            throw new Error(`Company with registration number ${company.registrationNumber.toString()} already exists`);
        }
        this.companies.set(company.id, company);
    }

    async update(company: Company): Promise<void> {
        if (!this.companies.has(company.id)) {
            throw new Error(`Company with id ${company.id} not found`);
        }
        this.companies.set(company.id, company);
    }

    async findById(id: string): Promise<Company | null> {
        return this.companies.get(id) || null;
    }

    async findByRegistrationNumber(registrationNumber: RegistrationNumber): Promise<Company | null> {
        for (const company of this.companies.values()) {
            if (company.registrationNumber.equals(registrationNumber)) {
                return company;
            }
        }
        return null;
    }

    async findByEmployeeId(userId: string): Promise<Company | null> {
        for (const company of this.companies.values()) {
            if (company.hasEmployee(userId)) {
                return company;
            }
        }
        return null;
    }

    async findAll(): Promise<Company[]> {
        return Array.from(this.companies.values());
    }

    async findActive(): Promise<Company[]> {
        return Array.from(this.companies.values())
            .filter(company => company.isActive);
    }

    async exists(registrationNumber: RegistrationNumber): Promise<boolean> {
        return (await this.findByRegistrationNumber(registrationNumber)) !== null;
    }

    // Méthode utilitaire pour les tests
    clear(): void {
        this.companies.clear();
    }
}