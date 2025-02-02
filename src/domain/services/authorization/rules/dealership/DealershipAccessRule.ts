import { IAuthorizationRule } from "../interfaces/IAuthorizationRule";
import { AuthorizationContext } from "../../AuthorizationContext";
import { UserRole } from "@domain/enums/UserRole";

export class DealershipAccessRule implements IAuthorizationRule {
    private readonly dealershipPermissions = [
        UserRole.DEALERSHIP_MANAGER,
        UserRole.DEALERSHIP_EMPLOYEE,
        UserRole.DEALERSHIP_TECHNICIAN,
        UserRole.DEALERSHIP_STOCK_MANAGER
    ];

    public canAccess(context: AuthorizationContext): boolean {
        console.log(JSON.stringify(context))
        if (context.userRole === UserRole.TRIUMPH_ADMIN) {
            return true;
        }

        if (!this.isDealershipRole(context.userRole)) {
            return false;
        }

        if (!context.dealershipId || !context.resourceId) {
            console.log("1" + context.dealershipId)
            console.log("2"+context.resourceId)
            return false;
        }
        return context.dealershipId === context.resourceId;
    }

    private isDealershipRole(role: UserRole): boolean {
        return this.dealershipPermissions.includes(role);
    }
}