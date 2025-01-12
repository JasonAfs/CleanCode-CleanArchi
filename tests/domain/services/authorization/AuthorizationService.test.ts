import { AuthorizationService } from '@domain/services/authorization/AuthorizationService';
import { UserRole } from '@domain/enums/UserRole';
import { Permission } from '@domain/services/authorization/RolePermissions';

describe('AuthorizationService', () => {
    let authorizationService: AuthorizationService;

    beforeEach(() => {
        authorizationService = new AuthorizationService();
    });

    describe('hasPermission', () => {
        it('should return true if user has higher role', () => {
            expect(authorizationService.hasPermission(
                UserRole.TRIUMPH_ADMIN, 
                UserRole.DEALER_EMPLOYEE
            )).toBe(true);
        });

        it('should return true if user has same role', () => {
            expect(authorizationService.hasPermission(
                UserRole.DEALER_EMPLOYEE, 
                UserRole.DEALER_EMPLOYEE
            )).toBe(true);
        });

        it('should return false if user has lower role', () => {
            expect(authorizationService.hasPermission(
                UserRole.STOCK_MANAGER, 
                UserRole.DEALER_EMPLOYEE
            )).toBe(false);
        });
    });

    describe('hasSpecificPermission', () => {
        it('should allow TRIUMPH_ADMIN to do anything', () => {
            const permissions: Permission[] = [
                Permission.MANAGE_STOCK,
                Permission.PERFORM_MAINTENANCE,
                Permission.MANAGE_FLEET,
                Permission.ADMIN_ACCESS
            ];

            permissions.forEach(permission => {
                expect(authorizationService.hasSpecificPermission(
                    UserRole.TRIUMPH_ADMIN, 
                    permission
                )).toBe(true);
            });
        });

        it('should allow STOCK_MANAGER to manage stock only', () => {
            expect(authorizationService.hasSpecificPermission(
                UserRole.STOCK_MANAGER, 
                Permission.MANAGE_STOCK
            )).toBe(true);

            expect(authorizationService.hasSpecificPermission(
                UserRole.STOCK_MANAGER, 
                Permission.MANAGE_FLEET
            )).toBe(false);
        });

        it('should allow TECHNICIAN to perform maintenance only', () => {
            expect(authorizationService.hasSpecificPermission(
                UserRole.TECHNICIAN, 
                Permission.PERFORM_MAINTENANCE
            )).toBe(true);

            expect(authorizationService.hasSpecificPermission(
                UserRole.TECHNICIAN, 
                Permission.MANAGE_FLEET
            )).toBe(false);
        });
    });

    describe('convenience methods', () => {
        describe('canManageStock', () => {
            it('should allow STOCK_MANAGER to manage stock', () => {
                expect(authorizationService.canManageStock(UserRole.STOCK_MANAGER)).toBe(true);
            });

            it('should allow TRIUMPH_ADMIN to manage stock', () => {
                expect(authorizationService.canManageStock(UserRole.TRIUMPH_ADMIN)).toBe(true);
            });

            it('should not allow DEALER_EMPLOYEE to manage stock', () => {
                expect(authorizationService.canManageStock(UserRole.DEALER_EMPLOYEE)).toBe(false);
            });
        });

        describe('canPerformMaintenance', () => {
            it('should allow TECHNICIAN to perform maintenance', () => {
                expect(authorizationService.canPerformMaintenance(UserRole.TECHNICIAN)).toBe(true);
            });

            it('should allow TRIUMPH_ADMIN to perform maintenance', () => {
                expect(authorizationService.canPerformMaintenance(UserRole.TRIUMPH_ADMIN)).toBe(true);
            });

            it('should not allow STOCK_MANAGER to perform maintenance', () => {
                expect(authorizationService.canPerformMaintenance(UserRole.STOCK_MANAGER)).toBe(false);
            });
        });

        describe('canManageFleet', () => {
            it('should allow DEALER_EMPLOYEE to manage fleet', () => {
                expect(authorizationService.canManageFleet(UserRole.DEALER_EMPLOYEE)).toBe(true);
            });

            it('should allow PARTNER_EMPLOYEE to manage fleet', () => {
                expect(authorizationService.canManageFleet(UserRole.PARTNER_EMPLOYEE)).toBe(true);
            });

            it('should not allow TECHNICIAN to manage fleet', () => {
                expect(authorizationService.canManageFleet(UserRole.TECHNICIAN)).toBe(false);
            });
        });

        describe('isAdmin', () => {
            it('should return true only for TRIUMPH_ADMIN', () => {
                expect(authorizationService.isAdmin(UserRole.TRIUMPH_ADMIN)).toBe(true);
                expect(authorizationService.isAdmin(UserRole.DEALER_EMPLOYEE)).toBe(false);
                expect(authorizationService.isAdmin(UserRole.PARTNER_EMPLOYEE)).toBe(false);
                expect(authorizationService.isAdmin(UserRole.TECHNICIAN)).toBe(false);
                expect(authorizationService.isAdmin(UserRole.STOCK_MANAGER)).toBe(false);
            });
        });
    });
});