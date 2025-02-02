import { IAuthorizationRule } from "../interfaces/IAuthorizationRule";
import { DealershipAccessRule } from "./DealershipAccessRule";

export class DealershipRuleFactory {
    private static readonly rules = new Map<string, IAuthorizationRule>([
        ['access', new DealershipAccessRule()],
    ]);

    public static getRule(ruleType: string): IAuthorizationRule {
        const rule = this.rules.get(ruleType);
        if (!rule) {
            throw new Error(`Dealership rule not found: ${ruleType}`);
        }
        return rule;
    }
}