import { UserRole } from "@domain/enums/UserRole";
import { 
    Permission,
    ROLE_HIERARCHY,
    ROLE_PERMISSIONS 
} from "./RolePermissions";

export class AuthorizationService {
    public hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
        return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
    }

    public hasSpecificPermission(userRole: UserRole, permission: Permission): boolean {
        return ROLE_PERMISSIONS[permission].includes(userRole);
    }

    public canManageStock(userRole: UserRole): boolean {
        return this.hasSpecificPermission(userRole, Permission.MANAGE_STOCK);
    }

    public canPerformMaintenance(userRole: UserRole): boolean {
        return this.hasSpecificPermission(userRole, Permission.PERFORM_MAINTENANCE);
    }

    public canManageFleet(userRole: UserRole): boolean {
        return this.hasSpecificPermission(userRole, Permission.MANAGE_FLEET);
    }

    public isAdmin(userRole: UserRole): boolean {
        return this.hasSpecificPermission(userRole, Permission.ADMIN_ACCESS);
    }
}