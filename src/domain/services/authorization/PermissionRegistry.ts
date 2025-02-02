import { UserRole } from '@domain/enums/UserRole';
import { Permission } from './Permission';

export const ROLE_PERMISSIONS: ReadonlyMap<UserRole, ReadonlySet<Permission>> = new Map<UserRole, ReadonlySet<Permission>>([
  [
    UserRole.TRIUMPH_ADMIN,
    new Set([
      Permission.MANAGE_ALL_DEALERSHIPS,
      Permission.VIEW_ALL_DEALERSHIPS,
      Permission.MANAGE_DEALERSHIP,
      Permission.MANAGE_DEALERSHIP_EMPLOYEES,
      Permission.VIEW_DEALERSHIP_DETAILS,

      Permission.MANAGE_COMPANY,
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES,



      Permission.MANAGE_MOTORCYCLES,
      Permission.VIEW_MOTORCYCLES,
      Permission.MANAGE_MAINTENANCE,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_MANAGER,
    new Set([
      Permission.MANAGE_DEALERSHIP,
      Permission.MANAGE_DEALERSHIP_EMPLOYEES,
      Permission.VIEW_DEALERSHIP_DETAILS,

      Permission.MANAGE_COMPANY,
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES,

      Permission.MANAGE_MOTORCYCLES,
      Permission.VIEW_MOTORCYCLES,
      Permission.MANAGE_MAINTENANCE,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_EMPLOYEE,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.VIEW_MOTORCYCLES,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_TECHNICIAN,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.MANAGE_MAINTENANCE,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_STOCK_MANAGER,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.MANAGE_MOTORCYCLES,
      Permission.VIEW_MOTORCYCLES
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.COMPANY_MANAGER,
    new Set([
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_COMPANY_ASSIGNED_MOTORCYCLES,
      Permission.VIEW_MOTORCYCLES,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.COMPANY_DRIVER,
    new Set([
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_MOTORCYCLES,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.CLIENT,
    new Set([
      Permission.VIEW_MOTORCYCLES,
      Permission.VIEW_MAINTENANCE
    ]) as ReadonlySet<Permission>,
  ]
]);
