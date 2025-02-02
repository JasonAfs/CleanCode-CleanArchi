import { IAuthorizationRule } from "./rules/interfaces/IAuthorizationRule";
import { DealershipAccessRule } from "./rules/dealership/DealershipAccessRule";

export enum AuthorizationRuleType {
    DEALERSHIP_ACCESS = 'DEALERSHIP_ACCESS',
}

export class AuthorizationRuleFactory {
    private static ruleRegistry = new Map<AuthorizationRuleType, IAuthorizationRule>([
        [AuthorizationRuleType.DEALERSHIP_ACCESS, new DealershipAccessRule()],
    ]);

    public static getRule(type: AuthorizationRuleType): IAuthorizationRule {
        const rule = this.ruleRegistry.get(type);
        if (!rule) {
            throw new Error(`Authorization rule not found for type: ${type}`);
        }
        return rule;
    }
}