import { IUserProps } from '@domain/interfaces/IUserProps';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';
import { randomUUID } from 'crypto';

export class User {
  private readonly props: IUserProps;

  private constructor(props: IUserProps) {
    this.props = props;
  }

  public static create(
    props: Omit<IUserProps, 'createdAt' | 'updatedAt' | 'isActive' | 'id'>,
  ): User {
    return new User({
      ...props,
      id: randomUUID(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get companyId(): string {
    return this.props.companyId;
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

  // Business logic methods
  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public updateRole(newRole: UserRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  public updatePersonalInfo(firstName: string, lastName: string): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }

  public getHashedPassword(): string {
    return this.props.hashedPassword;
  }
  
  get dealershipId(): string | null {
    return this.props.dealershipId || null;
  }
}
