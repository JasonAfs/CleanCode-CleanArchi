import { UserRole } from '@domain/enums/UserRole';
import { Permission } from './Permission';

export const ROLE_PERMISSIONS: ReadonlyMap<UserRole, ReadonlySet<Permission>> = new Map<UserRole, ReadonlySet<Permission>>([
    [UserRole.TRIUMPH_ADMIN, new Set([
        Permission.MANAGE_SYSTEM_CONFIG,
        Permission.MANAGE_ALL_DEALERSHIPS,
        Permission.MANAGE_MAINTENANCE_INTERVALS,
        Permission.MANAGE_ALL_USERS,
        Permission.MANAGE_ALL_MOTORCYCLES,
        Permission.MANAGE_PARTS_CATALOG,
        Permission.VIEW_ALL_STATISTICS,
        Permission.CREATE_PARTNER_COMPANY,
        Permission.UPDATE_PARTNER_COMPANY,    // Ajout
        Permission.DEACTIVATE_PARTNER_COMPANY,    // Ajout
        Permission.VIEW_PARTNER_COMPANY,
        Permission.VIEW_COMPANY_EMPLOYEES,
        Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES
    ]) as ReadonlySet<Permission>],
    [UserRole.DEALERSHIP_MANAGER, new Set([
        Permission.MANAGE_DEALERSHIP_USERS,
        Permission.MANAGE_DEALERSHIP_MOTORCYCLES,
        Permission.MANAGE_PARTS_INVENTORY,
        Permission.MANAGE_INCIDENTS,
        Permission.VIEW_DEALERSHIP_STATISTICS,
        Permission.VALIDATE_TEST_RIDE,
        Permission.CREATE_PARTNER_COMPANY,
        Permission.UPDATE_PARTNER_COMPANY,    
        Permission.DEACTIVATE_PARTNER_COMPANY,    
        Permission.VIEW_PARTNER_COMPANY,
        Permission.VIEW_COMPANY_EMPLOYEES,
        Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES   
    ]) as ReadonlySet<Permission>],
    [UserRole.DEALERSHIP_EMPLOYEE, new Set([
        Permission.VIEW_PARTS_INVENTORY,
        Permission.MANAGE_TEST_RIDES,
        Permission.SCHEDULE_MAINTENANCE,
        Permission.VIEW_INCIDENTS,
        Permission.REPORT_INCIDENT,
        Permission.VIEW_PARTNER_COMPANY    
    ]) as ReadonlySet<Permission>],
    [UserRole.DEALERSHIP_TECHNICIAN, new Set([
        Permission.PERFORM_MAINTENANCE,
        Permission.VIEW_PARTS_INVENTORY,
        Permission.VIEW_MAINTENANCE_HISTORY,
        Permission.REPORT_INCIDENT
    ]) as ReadonlySet<Permission>],
    [UserRole.COMPANY_MANAGER, new Set([
        Permission.MANAGE_COMPANY_USERS,
        Permission.VIEW_COMPANY_MOTORCYCLES,
        Permission.SCHEDULE_MAINTENANCE,
        Permission.VIEW_COMPANY_STATISTICS,
        Permission.MANAGE_INCIDENTS,
        Permission.VIEW_PARTNER_COMPANY,
        Permission.VIEW_COMPANY_EMPLOYEES,
        Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES
    ]) as ReadonlySet<Permission>],
    [UserRole.COMPANY_DRIVER, new Set([
        Permission.VIEW_COMPANY_MOTORCYCLES,
        Permission.UPDATE_MOTORCYCLE_STATUS,
        Permission.REPORT_INCIDENT,
        Permission.VIEW_MAINTENANCE_HISTORY
    ]) as ReadonlySet<Permission>],
    [UserRole.CLIENT, new Set([
        Permission.SCHEDULE_TEST_RIDE,
        Permission.VIEW_MAINTENANCE_HISTORY
    ]) as ReadonlySet<Permission>]
]);