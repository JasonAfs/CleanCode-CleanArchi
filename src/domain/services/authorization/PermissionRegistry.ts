import { UserRole } from '@domain/enums/UserRole';
import { Permission } from './Permission';

export const ROLE_PERMISSIONS: ReadonlyMap<
  UserRole,
  ReadonlySet<Permission>
> = new Map<UserRole, ReadonlySet<Permission>>([
  [
    UserRole.TRIUMPH_ADMIN,
    new Set([
      // Permissions Dealership
      Permission.MANAGE_ALL_DEALERSHIPS,
      Permission.VIEW_ALL_DEALERSHIPS,
      Permission.MANAGE_DEALERSHIP,
      Permission.MANAGE_DEALERSHIP_EMPLOYEES,
      Permission.VIEW_DEALERSHIP_DETAILS,

      // Permissions Company
      Permission.MANAGE_COMPANY,
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,

      // Permissions Motorcycle
      Permission.MANAGE_MOTORCYCLE,
      Permission.ASSIGN_MOTORCYCLE,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
      Permission.VIEW_MOTORCYCLE_DETAILS,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_MANAGER,
    new Set([
      // Permissions Dealership
      Permission.MANAGE_DEALERSHIP,
      Permission.MANAGE_DEALERSHIP_EMPLOYEES,
      Permission.VIEW_DEALERSHIP_DETAILS,

      // Permissions Company
      Permission.MANAGE_COMPANY,
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,

      // Permissions Motorcycle
      Permission.MANAGE_MOTORCYCLE,
      Permission.ASSIGN_MOTORCYCLE,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
      Permission.VIEW_MOTORCYCLE_DETAILS,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_EMPLOYEE,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
      Permission.VIEW_MOTORCYCLE_DETAILS,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_TECHNICIAN,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
      Permission.VIEW_MOTORCYCLE_DETAILS,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.DEALERSHIP_STOCK_MANAGER,
    new Set([
      Permission.VIEW_DEALERSHIP_DETAILS,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
      Permission.VIEW_MOTORCYCLE_DETAILS,
      Permission.ASSIGN_MOTORCYCLE,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.COMPANY_MANAGER,
    new Set([
      Permission.MANAGE_COMPANY_USERS,
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_MOTORCYCLE_DETAILS,
      Permission.UPDATE_MOTORCYCLE_MILEAGE,
    ]) as ReadonlySet<Permission>,
  ],
  [
    UserRole.COMPANY_DRIVER,
    new Set([
      Permission.VIEW_COMPANY_DETAILS,
      Permission.VIEW_MOTORCYCLE_DETAILS,
      Permission.UPDATE_MOTORCYCLE_MILEAGE, // Les conducteurs peuvent mettre à jour le kilométrage
    ]) as ReadonlySet<Permission>,
  ],
  [UserRole.CLIENT, new Set([]) as ReadonlySet<Permission>],
]);
