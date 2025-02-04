import { IAuthorizationRule } from '../interfaces/IAuthorizationRule';
import { AuthorizationContext } from '../../types/AuthorizationContext';

export abstract class BaseAuthorizationRule implements IAuthorizationRule {
  abstract canAccess(context: AuthorizationContext): boolean;

  protected hasRequiredContext(
    context: AuthorizationContext,
    requiredFields: (keyof AuthorizationContext)[],
  ): boolean {
    return requiredFields.every(
      (field) => Object.hasOwn(context, field) && context[field] !== undefined,
    );
  }
}
