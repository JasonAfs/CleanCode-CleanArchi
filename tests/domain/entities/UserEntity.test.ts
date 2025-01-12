// tests/domain/entities/User.test.ts
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';

describe('User Entity', () => {
    const validUserProps = {
        email: new Email('test@example.com'),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DEALER_EMPLOYEE,
        companyId: 'company123',
        hashedPassword: 'hashedPassword123'
    };

    // Mock des dates pour les tests
    const mockDate = new Date('2023-01-01T00:00:00.000Z');

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('creation', () => {
        it('should create a valid user', () => {
            const user = User.create(validUserProps);

            expect(user.email).toEqual(validUserProps.email);
            expect(user.firstName).toBe(validUserProps.firstName);
            expect(user.lastName).toBe(validUserProps.lastName);
            expect(user.role).toBe(validUserProps.role);
            expect(user.companyId).toBe(validUserProps.companyId);
            expect(user.isActive).toBe(true);
            expect(user.id).toBeDefined();
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('getters', () => {
        let user: User;

        beforeEach(() => {
            user = User.create(validUserProps);
        });

        it('should return the correct fullName', () => {
            expect(user.fullName).toBe(`${validUserProps.firstName} ${validUserProps.lastName}`);
        });

        it('should return the correct email', () => {
            expect(user.email.toString()).toBe(validUserProps.email.toString());
        });

        it('should return the correct role', () => {
            expect(user.role).toBe(validUserProps.role);
        });

        it('should return the correct company ID', () => {
            expect(user.companyId).toBe(validUserProps.companyId);
        });
    });

    describe('business methods', () => {
        let user: User;
        
        beforeEach(() => {
            user = User.create(validUserProps);
        });

        describe('activation/deactivation', () => {
            it('should deactivate user', () => {
                user.deactivate();
                expect(user.isActive).toBe(false);
            });

            it('should activate user', () => {
                user.deactivate();
                user.activate();
                expect(user.isActive).toBe(true);
            });

            it('should update updatedAt when activating', () => {
                const beforeUpdate = user.updatedAt;
                jest.advanceTimersByTime(1000); // Avance le temps d'une seconde
                user.activate();
                expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
            });

            it('should update updatedAt when deactivating', () => {
                const beforeUpdate = user.updatedAt;
                jest.advanceTimersByTime(1000);
                user.deactivate();
                expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
            });
        });

        describe('role update', () => {
            it('should update role', () => {
                const newRole = UserRole.TECHNICIAN;
                user.updateRole(newRole);
                expect(user.role).toBe(newRole);
            });

            it('should update updatedAt when changing role', () => {
                const beforeUpdate = user.updatedAt;
                jest.advanceTimersByTime(1000);
                user.updateRole(UserRole.TECHNICIAN);
                expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
            });
        });

        describe('personal info update', () => {
            it('should update firstName and lastName', () => {
                const newFirstName = 'Jane';
                const newLastName = 'Smith';
                user.updatePersonalInfo(newFirstName, newLastName);
                
                expect(user.firstName).toBe(newFirstName);
                expect(user.lastName).toBe(newLastName);
                expect(user.fullName).toBe(`${newFirstName} ${newLastName}`);
            });

            it('should update updatedAt when changing personal info', () => {
                const beforeUpdate = user.updatedAt;
                jest.advanceTimersByTime(1000);
                user.updatePersonalInfo('Jane', 'Smith');
                expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
            });
        });
    });
});