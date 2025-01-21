import { ICompanyProps } from "@domain/interfaces/ICompanyProps";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { RegistrationNumber } from "@domain/value-objects/RegistrationNumber";
import { CompanyEmployees } from "@domain/aggregates/company/CompanyEmployees";
import { User } from "@domain/entities/UserEntity";
import { CompanyValidationError } from "@domain/errors/company/CompanyValidationError";
import { randomUUID } from "crypto";

export class Company {
    private readonly props: ICompanyProps;

    private constructor(props: ICompanyProps) {
        this.props = props;
    }

    public static create(
        props: Omit<ICompanyProps, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'employees'>
    ): Company {
        if (!props.name.trim()) {
            throw new CompanyValidationError("Company name cannot be empty");
        }

        return new Company({
            ...props,
            id: randomUUID(),
            employees: CompanyEmployees.create(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
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

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    private updateLastModified(): void {
        this.props.updatedAt = new Date();
    }

    // Méthodes d'état
    public deactivate(): void {
        this.props.isActive = false;
        this.updateLastModified();
    }

    public activate(): void {
        this.props.isActive = true;
        this.updateLastModified();
    }

    // Méthodes de mise à jour
    public updateContactInfo(contactInfo: ContactInfo): void {
        this.props.contactInfo = contactInfo;
        this.updateLastModified();
    }

    public updateAddress(address: Address): void {
        this.props.address = address;
        this.updateLastModified();
    }

    public updateName(name: string): void {
        if (!name.trim()) {
            throw new CompanyValidationError("Company name cannot be empty");
        }
        this.props.name = name.trim();
        this.updateLastModified();
    }

    // Méthodes de gestion des employés
    public addEmployee(user: User): void {
        this.props.employees = this.props.employees.addEmployee(user);
        this.updateLastModified();
    }

    public removeEmployee(userId: string): void {
        this.props.employees = this.props.employees.removeEmployee(userId);
        this.updateLastModified();
    }

    public hasEmployee(userId: string): boolean {
        return this.props.employees.hasEmployee(userId);
    }

    // Méthodes de filtrage des employés
    public getDrivers(): User[] {
        return this.props.employees.getDrivers();
    }

    public getCompanyEmployees(): User[] {
        return this.props.employees.getCompanyEmployees();
    }

    // Méthodes de validation supplémentaires
    public isValidForRegistration(): boolean {
        // Une entreprise valide doit avoir au moins un employé company manager
        return this.getCompanyEmployees().length > 0;
    }
    
    get createdByDealershipId(): string | undefined {
        return this.props.createdByDealershipId;
    }

    public belongsToDealership(dealershipId: string | undefined): boolean {
        if (!dealershipId || !this.props.createdByDealershipId) {
            return false;
        }
        return this.props.createdByDealershipId === dealershipId;
    }
}