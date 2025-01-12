import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByCompanyId(companyId: string): Promise<User[]>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  findActive(): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  exists(email: Email): Promise<boolean>;
}
