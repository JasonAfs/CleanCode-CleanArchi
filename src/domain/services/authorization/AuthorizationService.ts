import { UserRole } from "@domain/enums/UserRole";
import { AuthorizationContext } from "./AuthorizationContext";
import { Permission } from "./Permission";
import { ROLE_PERMISSIONS } from "./PermissionRegistry";

export class AuthorizationService {
    constructor(private readonly permissionRegistry: ReadonlyMap<UserRole, ReadonlySet<Permission>> = ROLE_PERMISSIONS) {}

    public hasPermission(context: AuthorizationContext, requiredPermission: Permission): boolean {

        // 1. Vérifier si l'utilisateur a la permission requise
        const userPermissions = this.permissionRegistry.get(context.userRole);
        if (!userPermissions?.has(requiredPermission)) {
            return false;
        }

        // 2. Les admins ont toujours accès à tout
        if (context.userRole === UserRole.TRIUMPH_ADMIN) {
            return true;
        }

        // 3. Vérifier le contexte selon le type d'utilisateur
        switch (context.userRole) {
            case UserRole.DEALERSHIP_MANAGER:
            case UserRole.DEALERSHIP_EMPLOYEE:
            case UserRole.DEALERSHIP_TECHNICIAN:
                // Vérifier que l'utilisateur accède à sa propre concession
                return context.dealershipId ? true : false;

            case UserRole.COMPANY_MANAGER:
            case UserRole.COMPANY_DRIVER:
                // Vérifier que l'utilisateur accède à sa propre entreprise
                return context.companyId ? true : false;

            case UserRole.CLIENT:
                // Les clients ne peuvent accéder qu'à leurs propres ressources
                return context.userId === context.resourceId;

            default:
                return false;
        }
    }
}