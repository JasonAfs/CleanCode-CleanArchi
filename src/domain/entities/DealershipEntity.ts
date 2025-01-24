import { IDealershipProps } from '@domain/interfaces/IDealershipProps';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { User } from '@domain/entities/UserEntity';
import { UserRole } from '@domain/enums/UserRole';
import { randomUUID } from 'crypto';
import { Motorcycle } from './MotorcycleEntity';

export class Dealership {
  private readonly props: IDealershipProps;

  private constructor(props: IDealershipProps) {
    this.props = props;
  }

  public static create(
    props: Omit<
      IDealershipProps,
      'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'employees' | 'motorcycles'
    >,
  ): Dealership {
    if (!props.name.trim()) {
      throw new DealershipValidationError('Dealership name cannot be empty');
    }

    return new Dealership({
      ...props,
      id: randomUUID(),
      employees: DealershipEmployees.create(),
      motorcycles: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
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

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get motorcycles(): Motorcycle[] {
    return this.props.motorcycles;
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
      throw new DealershipValidationError('Dealership name cannot be empty');
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

  public getTechnicians(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_TECHNICIAN);
  }

  public getDealershipEmployees(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_EMPLOYEE);
  }

  public getStockManagers(): User[] {
    return this.props.employees.getByRole(UserRole.DEALERSHIP_STOCK_MANAGER);
  }

  public addMotorcycle(motorcycle: Motorcycle): void {
    this.props.motorcycles.push(motorcycle);
    this.updateLastModified();
}

public removeMotorcycle(motorcycleId: string): void {
    this.props.motorcycles = this.props.motorcycles.filter(
        moto => moto.id !== motorcycleId
    );
    this.updateLastModified();
}

public hasMotorcycle(motorcycleId: string): boolean {
    return this.props.motorcycles.some(moto => moto.id === motorcycleId);
}
}
