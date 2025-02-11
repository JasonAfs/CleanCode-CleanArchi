import { UserRole } from '@domain/enums/UserRole';
import { Permission } from '../../../domain/services/authorization/Permission';
import { AuthorizationContext } from '../../../domain/services/authorization/types/AuthorizationContext';
import { ROLE_PERMISSIONS } from '../../../domain/services/authorization/PermissionRegistry';
import { DealershipOperationChecker } from '../../../domain/services/authorization/operations/DealershipOperationChecker';
import { CompanyOperationChecker } from '../../../domain/services/authorization/operations/CompanyOperationChecker';
import { PermissionRuleMapper } from '../../../domain/services/authorization/mapping/PermissionRuleMapper';
import { IAuthorizationService } from '@domain/services/authorization/ports/IAuthorizationService';

interface OperationCheckers {
  dealership: DealershipOperationChecker;
  company: CompanyOperationChecker;
}

export class AuthorizationService implements IAuthorizationService {
  private readonly operationCheckers: OperationCheckers = {
    dealership: new DealershipOperationChecker(),
    company: new CompanyOperationChecker(),
  };

  constructor(
    private readonly permissionRegistry: ReadonlyMap<
      UserRole,
      ReadonlySet<Permission>
    > = ROLE_PERMISSIONS,
  ) {}

  public hasPermission(
    context: AuthorizationContext,
    requiredPermission: Permission,
  ): boolean {
    const userPermissions = this.permissionRegistry.get(context.userRole);
    if (!userPermissions?.has(requiredPermission)) {
      return false;
    }

    try {
      const ruleType = PermissionRuleMapper.getRuleType(requiredPermission);
      const [domain] = ruleType.split('.') as [keyof OperationCheckers];

      const checker = this.operationCheckers[domain];
      if (checker) {
        return checker.verifyAccess(context, requiredPermission);
      }

      return true;
    } catch {
      return true;
    }
  }

  public hasAllPermissions(
    context: AuthorizationContext,
    permissions: Permission[],
  ): boolean {
    return permissions.every((permission) =>
      this.hasPermission(context, permission),
    );
  }

  public hasAnyPermission(
    context: AuthorizationContext,
    permissions: Permission[],
  ): boolean {
    return permissions.some((permission) =>
      this.hasPermission(context, permission),
    );
  }

  public getPermissionsForRole(role: UserRole): ReadonlySet<Permission> {
    return this.permissionRegistry.get(role) ?? new Set();
  }
}
