import { UserRole } from "@domain/enums/UserRole";
import { Dealership } from "@domain/entities/DealershipEntity";

export class DealershipAuthorizationService {
    private readonly dealershipRoles = [
        UserRole.DEALERSHIP_MANAGER,
        UserRole.DEALERSHIP_EMPLOYEE,
        UserRole.DEALERSHIP_TECHNICIAN,
        UserRole.DEALERSHIP_STOCK_MANAGER
    ];

    public canAccessDealership(userId: string, userRole: UserRole, dealership: Dealership): boolean {
        // Les admins ont accès à tout
        if (userRole === UserRole.TRIUMPH_ADMIN) {
            return true;
        }

        // Les employés de concession ne peuvent voir que leur concession
        if (this.isDealershipRole(userRole)) {
            return dealership.hasEmployee(userId);
        }

        return false;
    }

    public isDealershipRole(role: UserRole): boolean {
        return this.dealershipRoles.includes(role);
    }

    public getDealershipRoles(): UserRole[] {
        return [...this.dealershipRoles];
    }
}