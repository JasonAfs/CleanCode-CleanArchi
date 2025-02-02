import { Permission } from "../Permission";
import { AuthorizationContext } from "../AuthorizationContext";
import { DealershipRuleFactory } from "../rules/dealership/DealershipRuleFactory";

export class DealershipOperationChecker {
    private readonly dealershipOperations = new Set([
        Permission.MANAGE_DEALERSHIP_EMPLOYEES,
        Permission.VIEW_DEALERSHIP_DETAILS,
    ]);

    public isDealershipOperation(permission: Permission): boolean {
        return this.dealershipOperations.has(permission);
    }

    public verifyAccess(context: AuthorizationContext, permission: Permission): boolean {
        const rule = DealershipRuleFactory.getRule('access');
        return rule.canAccess(context);
    }
}