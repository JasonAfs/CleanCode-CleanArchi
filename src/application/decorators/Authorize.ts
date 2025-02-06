import { PermissionRequirement } from '@domain/services/authorization/Permission';
import { AuthorizationContext } from '@domain/services/authorization/types/AuthorizationContext';
import { AuthorizationService } from '@application/services/authorization/AuthorizationService';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { IAuthorizationAware } from '@domain/services/authorization/ports/IAuthorizationAware';

export function Authorize(requiredPermissions: PermissionRequirement) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const instance = this as unknown as IAuthorizationAware;

      if (
        !instance.getAuthorizationContext ||
        typeof instance.getAuthorizationContext !== 'function'
      ) {
        throw new Error('Class must implement getAuthorizationContext method');
      }

      const context: AuthorizationContext = instance.getAuthorizationContext(
        ...args,
      );

      // Instance unique du service d'autorisation
      const authService = new AuthorizationService();

      if (Array.isArray(requiredPermissions)) {
        const hasAnyPermission = requiredPermissions.some((permission) =>
          authService.hasPermission(context, permission),
        );

        if (!hasAnyPermission) {
          throw new UnauthorizedError(
            `Missing requireddd permissions: ${requiredPermissions.join(' or ')}`,
          );
        }
      } else {
        if (!authService.hasPermission(context, requiredPermissions)) {
          throw new UnauthorizedError(
            `Missing required permission: ${requiredPermissions}`,
          );
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
