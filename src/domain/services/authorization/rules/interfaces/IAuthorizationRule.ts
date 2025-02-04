import { AuthorizationContext } from '../../types/AuthorizationContext';

export interface IAuthorizationRule {
  canAccess(context: AuthorizationContext): boolean;
}
