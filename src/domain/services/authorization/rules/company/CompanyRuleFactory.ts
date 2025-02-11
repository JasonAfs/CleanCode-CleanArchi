import { IAuthorizationRule } from '../interfaces/IAuthorizationRule';
import { CompanyAccessRule } from './CompanyAccessRule';

export class CompanyRuleFactory {
  private static readonly rules = new Map<string, IAuthorizationRule>([
    ['access', new CompanyAccessRule()],
  ]);

  public static getRule(ruleType: string): IAuthorizationRule {
    const rule = this.rules.get(ruleType);
    if (!rule) {
      throw new Error(`Company rule not found: ${ruleType}`);
    }
    return rule;
  }
}
