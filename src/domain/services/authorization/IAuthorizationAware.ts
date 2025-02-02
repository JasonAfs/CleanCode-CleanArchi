import { AuthorizationContext } from "./AuthorizationContext";

export interface IAuthorizationAware {
    getAuthorizationContext(...args: any[]): AuthorizationContext;
}