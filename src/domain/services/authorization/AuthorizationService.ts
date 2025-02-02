import { UserRole } from '@domain/enums/UserRole';
import { Permission } from './Permission';
import { AuthorizationContext } from './AuthorizationContext';
import { ROLE_PERMISSIONS } from './PermissionRegistry';
import { DealershipOperationChecker } from './operations/DealershipOperationChecker';
import { CompanyOperationChecker } from './operations/CompanyOperationChecker';
import { PermissionRuleMapper } from './mapping/PermissionRuleMapper';

interface OperationCheckers {
  dealership: DealershipOperationChecker;
  company: CompanyOperationChecker;
}

export class AuthorizationService {
  private readonly operationCheckers: OperationCheckers = {
    dealership: new DealershipOperationChecker(),
    company: new CompanyOperationChecker()
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
    // 1. Vérification des permissions de base du rôle
    const userPermissions = this.permissionRegistry.get(context.userRole);
    if (!userPermissions?.has(requiredPermission)) {
      return false;
    }

    try {
      // 2. Récupération et application des règles spécifiques
      const ruleType = PermissionRuleMapper.getRuleType(requiredPermission);
      const [domain] = ruleType.split('.') as [keyof OperationCheckers];

      // 3. Vérification avec le checker approprié
      const checker = this.operationCheckers[domain];
      if (checker) {
        return checker.verifyAccess(context, requiredPermission);
      }

      // 4. Fallback pour les permissions sans règles spécifiques
      return true;
    } catch {
      // 5. Si aucune règle n'est mappée, on considère que c'est une permission simple
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