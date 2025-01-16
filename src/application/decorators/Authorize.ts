import { Permission } from "@domain/services/authorization/Permission";
import { AuthorizationContext } from "@domain/services/authorization/AuthorizationContext";
import { AuthorizationService } from "@domain/services/authorization/AuthorizationService";
import { UnauthorizedError } from "@domain/errors/authorization/UnauthorizedError";

export type PermissionRequirement = Permission | Permission[];

export interface IAuthorizationAware {
    getAuthorizationContext(...args: any[]): AuthorizationContext;
}

export function Authorize(requiredPermissions: PermissionRequirement) {
    return function (
        target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // this fait référence à l'instance de la classe actuelle
            const instance = this as unknown as IAuthorizationAware;
            
            // Vérifier que l'instance implémente l'interface
            if (!instance.getAuthorizationContext || typeof instance.getAuthorizationContext !== 'function') {
                throw new Error('Class must implement getAuthorizationContext method');
            }

            const context: AuthorizationContext = instance.getAuthorizationContext(...args);
            
            // Instance unique du service d'autorisation
            const authService = new AuthorizationService();

            // Vérifier les permissions
            if (Array.isArray(requiredPermissions)) {
                const hasAnyPermission = requiredPermissions.some(permission => 
                    authService.hasPermission(context, permission)
                );
                
                if (!hasAnyPermission) {
                    throw new UnauthorizedError(
                        `Missing required permissions: ${requiredPermissions.join(' or ')}`
                    );
                }
            } else {
                // Cas d'une seule permission requise
                if (!authService.hasPermission(context, requiredPermissions)) {
                    throw new UnauthorizedError(
                        `Missing required permission: ${requiredPermissions}`
                    );
                }
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}