import { IAuthorizationRule } from "../interfaces/IAuthorizationRule";
import { AuthorizationContext } from "../../AuthorizationContext";
import { UserRole } from "@domain/enums/UserRole";

export class CompanyAccessRule implements IAuthorizationRule {
    private readonly companyPermissions = [
        UserRole.COMPANY_MANAGER,
        UserRole.COMPANY_DRIVER
    ];

    private readonly dealershipPermissions = [
        UserRole.DEALERSHIP_MANAGER
    ];

    public canAccess(context: AuthorizationContext): boolean {
        // Admin a toujours accès
        if (context.userRole === UserRole.TRIUMPH_ADMIN) {
            return true;
        }

        // Vérification pour les managers d'entreprise
        if (this.isCompanyRole(context.userRole)) {
            return context.companyId === context.resourceId;
        }

        // Vérification pour les managers de concession
        if (this.isDealershipManagerRole(context.userRole)) {
            if (!context.dealershipId) {
                return false;
            }
            
            // ResourceType 'company' indique qu'on accède à une entreprise
            if (context.resourceType === 'company') {
                // La vérification que la concession a créé l'entreprise se fait au niveau
                // du use case via la propriété createdByDealershipId de l'entité Company
                return true;
            }
        }

        return false;
    }

    private isCompanyRole(role: UserRole): boolean {
        return this.companyPermissions.includes(role);
    }

    private isDealershipManagerRole(role: UserRole): boolean {
        return this.dealershipPermissions.includes(role);
    }
}