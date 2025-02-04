import { AuthorizationContext } from '../types/AuthorizationContext';

export interface IAuthorizationAware {
  getAuthorizationContext(...args: any[]): AuthorizationContext;
}
