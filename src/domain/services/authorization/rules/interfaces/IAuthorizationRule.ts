import { AuthorizationContext } from "../../AuthorizationContext";

export interface IAuthorizationRule {
    canAccess(context: AuthorizationContext): boolean;
}