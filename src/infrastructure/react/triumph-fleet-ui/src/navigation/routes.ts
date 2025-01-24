import { UserRole } from '@domain/enums/UserRole';

export interface RouteConfig {
    path: string;
    title: string;
    icon?: string;
    allowedRoles: UserRole[];
}

export const routes: RouteConfig[] = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        allowedRoles: Object.values(UserRole), // Accessible à tous les rôles
    },
    {
        title: "Users",
        path: "/user",
        icon: "Users",
        allowedRoles: [UserRole.TRIUMPH_ADMIN],
    },
    {
        title: "Companies",
        path: "/company",
        icon: "Building",
        allowedRoles: [UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER],
    }
];