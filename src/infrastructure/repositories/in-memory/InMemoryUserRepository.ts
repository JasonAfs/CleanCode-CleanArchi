import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';
import { UserNotFoundError } from '@domain/errors/user/UserNotFoundError';
import { UserAlreadyExistsError } from '@domain/errors/user/UserAlreadyExistsError';

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: Map<string, User> = new Map();

  public async create(user: User): Promise<void> {
    if (await this.exists(user.email)) {
      throw new UserAlreadyExistsError(user.email.toString());
    }
    this.users.set(user.id, user);
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  public async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.toString() === email.toString()) {
        return user;
      }
    }
    return null;
  }

  public async findByCompanyId(companyId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.companyId === companyId,
    );
  }

  public async update(user: User): Promise<void> {
    if (!this.users.has(user.id)) {
      throw new UserNotFoundError(user.id);
    }
    this.users.set(user.id, user);
  }

  public async delete(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new UserNotFoundError(id);
    }
    this.users.delete(id);
  }

  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  public async findActive(): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.isActive);
  }

  public async findByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }

  public async exists(email: Email): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.email.toString() === email.toString()) {
        return true;
      }
    }
    return false;
  }

  // Méthode utilitaire pour les tests
  public clear(): void {
    this.users.clear();
  }
}
