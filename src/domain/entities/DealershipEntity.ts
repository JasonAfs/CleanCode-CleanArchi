import {
  DealershipProps,
  CreateDealershipProps,
  ReconstituteDealershipProps,
} from '@domain/interfaces/dealership/IDealershipProps';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { DealershipMotorcycles } from '@domain/aggregates/dealership/DealershipMotorcycles';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { User } from '@domain/entities/UserEntity';
import { UserRole } from '@domain/enums/UserRole';
import { randomUUID } from 'crypto';

export class Dealership {
  private readonly props: DealershipProps;

  private constructor(props: DealershipProps) {
    this.props = props;
  }

  public static create(props: CreateDealershipProps): Dealership {
    if (!props.name.trim()) {
      throw new DealershipValidationError('Dealership name cannot be empty');
    }

    const id = randomUUID();
    return new Dealership({
      ...props,
      id,
      employees: DealershipEmployees.create(),
      motorcycles: DealershipMotorcycles.create(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(
    props: ReconstituteDealershipProps,
    employees: DealershipEmployees = DealershipEmployees.create(),
    motorcycles: DealershipMotorcycles = DealershipMotorcycles.create(),
  ): Dealership {
    return new Dealership({
      ...props,
      employees,
      motorcycles,
    });
  }

  // Getters existants
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): Address {
    return this.props.address;
  }

  get contactInfo(): ContactInfo {
    return this.props.contactInfo;
  }

  get employees(): DealershipEmployees {
    return this.props.employees;
  }

  get motorcycles(): DealershipMotorcycles {
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

  private updateLastModified(): void {
    this.props.updatedAt = new Date();
  }

  // Méthodes pour la gestion des motos
  public addMotorcycle(motorcycle: Motorcycle, userRole: UserRole): void {
    if (!this.props.isActive) {
      throw new DealershipValidationError(
        'Cannot add motorcycle to an inactive dealership',
      );
    }
    this.props.motorcycles = this.props.motorcycles.addMotorcycle(motorcycle, userRole);
    this.updateLastModified();
  }

  public removeMotorcycle(motorcycleId: string, userRole: UserRole): void {
    if (!this.props.isActive) {
      throw new DealershipValidationError(
        'Cannot remove motorcycle from an inactive dealership',
      );
    }
    this.props.motorcycles = this.props.motorcycles.removeMotorcycle(motorcycleId, userRole);
    this.updateLastModified();
  }

  public getMotorcycle(motorcycleId: string): Motorcycle | undefined {
    return this.props.motorcycles.getMotorcycleById(motorcycleId);
  }

  public hasMotorcycle(motorcycleId: string): boolean {
    return this.props.motorcycles.hasMotorcycle(motorcycleId);
  }

  // Méthodes d'état existantes
  public deactivate(): void {
    if (!this.props.isActive) {
      throw new DealershipValidationError('Dealership is already inactive');
    }
    this.props.isActive = false;
    this.updateLastModified();
  }

  public activate(): void {
    if (this.props.isActive) {
      throw new DealershipValidationError('Dealership is already active');
    }
    this.props.isActive = true;
    this.updateLastModified();
  }

  // Méthodes de mise à jour existantes
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
      throw new DealershipValidationError('Dealership name cannot be empty');
    }
    this.props.name = name.trim();
    this.updateLastModified();
  }

  // Méthodes de gestion des employés existantes
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

  public getTechnicians(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_TECHNICIAN);
  }

  public getDealershipEmployees(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_EMPLOYEE);
  }

  public getStockManagers(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_STOCK_MANAGER);
  }
}