import { UserRole } from '@domain/enums/UserRole';
import { Permission } from '../Permission';
import { AuthorizationContext } from '../types/AuthorizationContext';

export interface IAuthorizationService {
  hasPermission(context: AuthorizationContext, permission: Permission): boolean;
  hasAllPermissions(
    context: AuthorizationContext,
    permissions: Permission[],
  ): boolean;
  hasAnyPermission(
    context: AuthorizationContext,
    permissions: Permission[],
  ): boolean;
  getPermissionsForRole(role: UserRole): ReadonlySet<Permission>;
}
