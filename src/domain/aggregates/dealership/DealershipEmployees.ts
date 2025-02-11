import { User } from '@domain/entities/UserEntity';
import { UserRole } from '@domain/enums/UserRole';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class DealershipEmployees {
  private constructor(private readonly employees: User[]) {}

  public static create(): DealershipEmployees {
    return new DealershipEmployees([]);
  }

  private isValidEmployeeRole(role: UserRole): boolean {
    return [
      UserRole.DEALERSHIP_EMPLOYEE,
      UserRole.DEALERSHIP_TECHNICIAN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_STOCK_MANAGER,
    ].includes(role);
  }

  public addEmployee(user: User): DealershipEmployees {
    if (!this.isValidEmployeeRole(user.role)) {
      throw new DealershipValidationError(
        'Invalid user role for dealership employee',
      );
    }

    if (this.hasEmployee(user.id)) {
      throw new DealershipValidationError(
        'Employee already exists in this dealership',
      );
    }

    return new DealershipEmployees([...this.employees, user]);
  }

  public removeEmployee(userId: string): DealershipEmployees {
    const newEmployees = this.employees.filter(
      (employee) => employee.id !== userId,
    );

    if (newEmployees.length === this.employees.length) {
      throw new DealershipValidationError(
        'Employee not found in this dealership',
      );
    }

    return new DealershipEmployees(newEmployees);
  }

  public hasEmployee(userId: string): boolean {
    return this.employees.some((employee) => employee.id === userId);
  }

  public getByRole(role: UserRole): User[] {
    return this.employees.filter((employee) => employee.role === role);
  }

  public getAll(): User[] {
    return [...this.employees];
  }
}
