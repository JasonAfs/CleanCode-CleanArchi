import { UserRole } from "@domain/enums/UserRole";

export enum Permission {
    MANAGE_STOCK = 'MANAGE_STOCK',
    PERFORM_MAINTENANCE = 'PERFORM_MAINTENANCE',
    MANAGE_FLEET = 'MANAGE_FLEET',
    ADMIN_ACCESS = 'ADMIN_ACCESS'
}

type RoleHierarchy = {
    readonly [key in UserRole]: number;
};

export const ROLE_HIERARCHY: RoleHierarchy = {
    [UserRole.TRIUMPH_ADMIN]: 5,
    [UserRole.DEALER_EMPLOYEE]: 4,
    [UserRole.PARTNER_EMPLOYEE]: 3,
    [UserRole.TECHNICIAN]: 2,
    [UserRole.STOCK_MANAGER]: 1
} as const;

type PermissionMap = {
    readonly [key in Permission]: ReadonlyArray<UserRole>;
};

export const ROLE_PERMISSIONS: PermissionMap = {
    [Permission.MANAGE_STOCK]: [
        UserRole.STOCK_MANAGER,
        UserRole.TRIUMPH_ADMIN
    ],
    [Permission.PERFORM_MAINTENANCE]: [
        UserRole.TECHNICIAN,
        UserRole.TRIUMPH_ADMIN
    ],
    [Permission.MANAGE_FLEET]: [
        UserRole.DEALER_EMPLOYEE,
        UserRole.PARTNER_EMPLOYEE,
        UserRole.TRIUMPH_ADMIN
    ],
    [Permission.ADMIN_ACCESS]: [
        UserRole.TRIUMPH_ADMIN
    ]
} as const;