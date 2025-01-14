import { DealershipEmployees } from "@domain/aggregates/dealership/DealershipEmployees";
import { User } from "@domain/entities/UserEntity";
import { UserRole } from "@domain/enums/UserRole";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { Email } from "@domain/value-objects/Email";

describe('DealershipEmployees', () => {
   let validUser: User;
   // On définit les props de base qu'on réutilisera
   const baseUserProps = {
       email: new Email('test@example.com'),
       firstName: 'John',
       lastName: 'Doe',
       companyId: 'dealership-123',
       hashedPassword: 'hashedPassword123'
   };

   beforeEach(() => {
       validUser = User.create({
           ...baseUserProps,
           role: UserRole.DEALER_EMPLOYEE,
       });
   });

   describe('create', () => {
       it('should create an empty dealership employees aggregate', () => {
           const employees = DealershipEmployees.create();
           expect(employees.getAll()).toHaveLength(0);
       });
   });

   describe('addEmployee', () => {
       it('should add valid DEALER_EMPLOYEE', () => {
           const employees = DealershipEmployees.create();
           const newEmployees = employees.addEmployee(validUser);
           expect(newEmployees.getAll()).toContain(validUser);
       });

       it('should add valid TECHNICIAN', () => {
           const technician = User.create({
               ...baseUserProps,
               role: UserRole.TECHNICIAN,
           });
           const employees = DealershipEmployees.create();
           const newEmployees = employees.addEmployee(technician);
           expect(newEmployees.getAll()).toContain(technician);
       });

       it('should add valid STOCK_MANAGER', () => {
           const stockManager = User.create({
               ...baseUserProps,
               role: UserRole.STOCK_MANAGER,
           });
           const employees = DealershipEmployees.create();
           const newEmployees = employees.addEmployee(stockManager);
           expect(newEmployees.getAll()).toContain(stockManager);
       });

       it('should throw error for invalid role (PARTNER_EMPLOYEE)', () => {
           const invalidUser = User.create({
               ...baseUserProps,
               role: UserRole.PARTNER_EMPLOYEE,
           });
           const employees = DealershipEmployees.create();

           expect(() => employees.addEmployee(invalidUser))
               .toThrow(DealershipValidationError);
       });

       it('should throw error for invalid role (TRIUMPH_ADMIN)', () => {
           const invalidUser = User.create({
               ...baseUserProps,
               role: UserRole.TRIUMPH_ADMIN,
           });
           const employees = DealershipEmployees.create();

           expect(() => employees.addEmployee(invalidUser))
               .toThrow(DealershipValidationError);
       });

       it('should throw error for duplicate employee', () => {
           const employees = DealershipEmployees.create();
           const withOneEmployee = employees.addEmployee(validUser);
           
           expect(() => withOneEmployee.addEmployee(validUser))
               .toThrow(DealershipValidationError);
       });
   });

   describe('removeEmployee', () => {
       it('should remove existing employee', () => {
           const employees = DealershipEmployees.create();
           const withEmployee = employees.addEmployee(validUser);
           const afterRemoval = withEmployee.removeEmployee(validUser.id);

           expect(afterRemoval.hasEmployee(validUser.id)).toBe(false);
       });

       it('should throw error for non-existent employee', () => {
           const employees = DealershipEmployees.create();
           
           expect(() => employees.removeEmployee('non-existent-id'))
               .toThrow(DealershipValidationError);
       });
   });

   describe('getByRole', () => {
       it('should get employees by role', () => {
           const technician = User.create({
               ...baseUserProps,
               role: UserRole.TECHNICIAN,
           });

           const stockManager = User.create({
               ...baseUserProps,
               role: UserRole.STOCK_MANAGER,
           });

           const employees = DealershipEmployees.create()
               .addEmployee(validUser)         // DEALER_EMPLOYEE
               .addEmployee(technician)        // TECHNICIAN
               .addEmployee(stockManager);     // STOCK_MANAGER

           const dealerEmployees = employees.getByRole(UserRole.DEALER_EMPLOYEE);
           const technicians = employees.getByRole(UserRole.TECHNICIAN);
           const stockManagers = employees.getByRole(UserRole.STOCK_MANAGER);

           expect(dealerEmployees).toHaveLength(1);
           expect(dealerEmployees[0]).toEqual(validUser);

           expect(technicians).toHaveLength(1);
           expect(technicians[0]).toEqual(technician);

           expect(stockManagers).toHaveLength(1);
           expect(stockManagers[0]).toEqual(stockManager);
       });

       it('should return empty array when no employees with specified role', () => {
           const employees = DealershipEmployees.create()
               .addEmployee(validUser);  // Only DEALER_EMPLOYEE

           const technicians = employees.getByRole(UserRole.TECHNICIAN);
           expect(technicians).toHaveLength(0);
       });
   });

   describe('hasEmployee', () => {
       it('should return true for existing employee', () => {
           const employees = DealershipEmployees.create()
               .addEmployee(validUser);

           expect(employees.hasEmployee(validUser.id)).toBe(true);
       });

       it('should return false for non-existing employee', () => {
           const employees = DealershipEmployees.create()
               .addEmployee(validUser);

           expect(employees.hasEmployee('non-existent-id')).toBe(false);
       });
   });

   describe('getAll', () => {
       it('should return all employees', () => {
           const technician = User.create({
               ...baseUserProps,
               role: UserRole.TECHNICIAN,
           });

           const employees = DealershipEmployees.create()
               .addEmployee(validUser)
               .addEmployee(technician);

           const allEmployees = employees.getAll();
           expect(allEmployees).toHaveLength(2);
           expect(allEmployees).toContain(validUser);
           expect(allEmployees).toContain(technician);
       });

       it('should return empty array when no employees', () => {
           const employees = DealershipEmployees.create();
           expect(employees.getAll()).toHaveLength(0);
       });
   });
});