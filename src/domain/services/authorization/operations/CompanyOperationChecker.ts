import { Permission } from '../Permission';
import { AuthorizationContext } from '../types/AuthorizationContext';
import { CompanyRuleFactory } from '../rules/company/CompanyRuleFactory';

export class CompanyOperationChecker {
  private readonly companyOperations = new Set([
    Permission.MANAGE_COMPANY,
    Permission.MANAGE_COMPANY_USERS,
    Permission.VIEW_COMPANY_DETAILS,
    Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES,
  ]);

  public isCompanyOperation(permission: Permission): boolean {
    return this.companyOperations.has(permission);
  }

  public verifyAccess(
    context: AuthorizationContext,
    permission: Permission,
  ): boolean {
    const rule = CompanyRuleFactory.getRule('access');
    return rule.canAccess(context);
  }
}
