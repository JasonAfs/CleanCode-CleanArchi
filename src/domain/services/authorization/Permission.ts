export enum Permission {
    // Permissions Admin
    MANAGE_ALL_DEALERSHIPS = 'MANAGE_ALL_DEALERSHIPS',
    VIEW_ALL_DEALERSHIPS = 'VIEW_ALL_DEALERSHIPS',

    // Permissions Concession
    MANAGE_DEALERSHIP = 'MANAGE_DEALERSHIP',           // Pour les opérations de base sur sa concession
    MANAGE_DEALERSHIP_EMPLOYEES = 'MANAGE_DEALERSHIP_EMPLOYEES',
    VIEW_DEALERSHIP_DETAILS = 'VIEW_DEALERSHIP_DETAILS',

    // Permissions Entreprise
    MANAGE_COMPANY = 'MANAGE_COMPANY',         // Inclut create, update, deactivate
    MANAGE_COMPANY_USERS = 'MANAGE_COMPANY_USERS',  // Pour la gestion des employés
    VIEW_COMPANY_DETAILS = 'VIEW_COMPANY_DETAILS',

}

export type PermissionRequirement = Permission | Permission[];