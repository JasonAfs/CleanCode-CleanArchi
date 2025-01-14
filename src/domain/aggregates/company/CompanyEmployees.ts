import { User } from "@domain/entities/UserEntity";
import { UserRole } from "@domain/enums/UserRole";
import { DomainError } from "@domain/errors/DomainError";

export class CompanyValidationError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class CompanyEmployees {
    private constructor(private readonly employees: User[]) {}

    public static create(): CompanyEmployees {
        return new CompanyEmployees([]);
    }

    private isValidEmployeeRole(role: UserRole): boolean {
        return [
            UserRole.PARTNER_EMPLOYEE,
            UserRole.DRIVER
        ].includes(role);
    }

    public addEmployee(user: User): CompanyEmployees {
        if (!this.isValidEmployeeRole(user.role)) {
            throw new CompanyValidationError("Invalid user role for company employee");
        }

        if (this.hasEmployee(user.id)) {
            throw new CompanyValidationError("Employee already exists in this company");
        }

        return new CompanyEmployees([...this.employees, user]);
    }

    public removeEmployee(userId: string): CompanyEmployees {
        const newEmployees = this.employees.filter(
            employee => employee.id !== userId
        );

        if (newEmployees.length === this.employees.length) {
            throw new CompanyValidationError("Employee not found in this company");
        }

        return new CompanyEmployees(newEmployees);
    }

    public hasEmployee(userId: string): boolean {
        return this.employees.some(employee => employee.id === userId);
    }

    public getByRole(role: UserRole): User[] {
        return this.employees.filter(
            employee => employee.role === role
        );
    }

    public getDrivers(): User[] {
        return this.getByRole(UserRole.DRIVER);
    }

    public getPartnerEmployees(): User[] {
        return this.getByRole(UserRole.PARTNER_EMPLOYEE);
    }

    public getAll(): User[] {
        return [...this.employees];
    }
}