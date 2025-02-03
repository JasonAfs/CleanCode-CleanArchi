import { CompanyProps, CreateCompanyProps, ReconstitueCompanyProps } from '@domain/interfaces/company/ICompanyProps';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { RegistrationNumber } from '@domain/value-objects/RegistrationNumber';
import { CompanyEmployees } from '@domain/aggregates/company/CompanyEmployees';
import { CompanyMotorcycles } from '@domain/aggregates/company/CompanyMotorcycles';
import { User } from '@domain/entities/UserEntity';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { CompanyValidationError } from '@domain/errors/company/CompanyValidationError';
import { randomUUID } from 'crypto';
import { MotorcycleAssignment } from '@domain/interfaces/motorcycle/IMotorcycleAssignment';

export class Company {
    private readonly props: CompanyProps;

    private constructor(props: CompanyProps) {
        this.props = props;
    }

    public static create(props: CreateCompanyProps): Company {
        if (!props.name.trim()) {
            throw new CompanyValidationError('Company name cannot be empty');
        }

        const id = randomUUID();
        return new Company({
            ...props,
            id,
            employees: CompanyEmployees.create(),
            motorcycles: CompanyMotorcycles.create(id),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public static reconstitute(
        props: ReconstitueCompanyProps, 
        employees: CompanyEmployees = CompanyEmployees.create(),
        motorcycles: CompanyMotorcycles = CompanyMotorcycles.create(props.id)
    ): Company {
        return new Company({
            ...props,
            employees,
            motorcycles
        });
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get registrationNumber(): RegistrationNumber {
        return this.props.registrationNumber;
    }

    get address(): Address {
        return this.props.address;
    }

    get contactInfo(): ContactInfo {
        return this.props.contactInfo;
    }

    get employees(): CompanyEmployees {
        return this.props.employees;
    }

    get motorcycles(): CompanyMotorcycles {
        return this.props.motorcycles;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get createdByDealershipId(): string | undefined {
        return this.props.createdByDealershipId;
    }

    private updateLastModified(): void {
        this.props.updatedAt = new Date();
    }

    // Méthodes d'état
    public deactivate(): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Company is already inactive');
        }
        this.props.isActive = false;
        this.updateLastModified();
    }

    public activate(): void {
        if (this.props.isActive) {
            throw new CompanyValidationError('Company is already active');
        }
        this.props.isActive = true;
        this.updateLastModified();
    }

    // Méthodes de mise à jour
    public updateContactInfo(contactInfo: ContactInfo): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot update contact info of an inactive company');
        }
        this.props.contactInfo = contactInfo;
        this.updateLastModified();
    }

    public updateAddress(address: Address): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot update address of an inactive company');
        }
        this.props.address = address;
        this.updateLastModified();
    }

    public updateName(name: string): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot update name of an inactive company');
        }
        if (!name.trim()) {
            throw new CompanyValidationError('Company name cannot be empty');
        }
        this.props.name = name.trim();
        this.updateLastModified();
    }

    // Méthodes de gestion des employés
    public addEmployee(user: User): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot add employee to an inactive company');
        }
        this.props.employees = this.props.employees.addEmployee(user);
        this.updateLastModified();
    }

    public removeEmployee(userId: string): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot remove employee from an inactive company');
        }
        this.props.employees = this.props.employees.removeEmployee(userId);
        this.updateLastModified();
    }

    public hasEmployee(userId: string): boolean {
        return this.props.employees.hasEmployee(userId);
    }

    public getDrivers(): User[] {
        return this.props.employees.getDrivers();
    }

    public getCompanyEmployees(): User[] {
        return this.props.employees.getCompanyEmployees();
    }

    // Méthodes de gestion des motos
    public assignMotorcycle(motorcycle: Motorcycle): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot assign motorcycle to an inactive company');
        }
        this.props.motorcycles = this.props.motorcycles.assignMotorcycle(motorcycle);
        this.updateLastModified();
    }

    public endMotorcycleAssignment(motorcycleId: string, motorcycle: Motorcycle): void {
        if (!this.props.isActive) {
            throw new CompanyValidationError('Cannot end motorcycle assignment in an inactive company');
        }
        this.props.motorcycles = this.props.motorcycles.endAssignment(motorcycleId, motorcycle);
        this.updateLastModified();
    }

    public getActiveMotorcycleAssignments(): MotorcycleAssignment[] {
        return this.props.motorcycles.getActiveAssignments();
    }

    public getMotorcycleAssignmentHistory(): MotorcycleAssignment[] {
        return this.props.motorcycles.getAssignmentHistory();
    }

    public hasActiveMotorcycleAssignment(motorcycleId: string): boolean {
        return this.props.motorcycles.hasActiveAssignment(motorcycleId);
    }

    public getMotorcycleStatistics() {
        return this.props.motorcycles.getAssignmentStatistics();
    }

    public belongsToDealership(dealershipId: string | undefined): boolean {
        if (!dealershipId || !this.props.createdByDealershipId) {
            return false;
        }
        return this.props.createdByDealershipId === dealershipId;
    }
}