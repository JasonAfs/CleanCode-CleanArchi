// tests/application/use-cases/dealership/AddDealershipEmployeeUseCase.test.ts
import { AddDealershipEmployeeUseCase } from "@application/use-cases/dealership/AddDealershipEmployeeUseCase";
import { AddDealershipEmployeeValidator } from "@application/validation/dealership/AddDealershipEmployeeValidator";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { UserNotFoundError } from "@domain/errors/user/UserNotFoundError";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { Dealership } from "@domain/entities/DealershipEntity";
import { User } from "@domain/entities/UserEntity";
import { Email } from "@domain/value-objects/Email";
import { UserRole } from "@domain/enums/UserRole";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";

const mockDealershipRepository: jest.Mocked<IDealershipRepository> = {
   create: jest.fn(),
   update: jest.fn(),
   findById: jest.fn(),
   findByName: jest.fn(),
   findByEmployee: jest.fn(),
   findAll: jest.fn(),
   findActive: jest.fn(),
   exists: jest.fn()
};

const mockUserRepository: jest.Mocked<IUserRepository> = {
   create: jest.fn(),
   update: jest.fn(),
   findById: jest.fn(),
   findByEmail: jest.fn(),
   findByCompanyId: jest.fn(),
   findAll: jest.fn(),
   findActive: jest.fn(),
   findByRole: jest.fn(),
   exists: jest.fn(),
   delete: jest.fn()
};

describe('AddDealershipEmployeeUseCase', () => {
   let useCase: AddDealershipEmployeeUseCase;
   let validator: AddDealershipEmployeeValidator;
   let dealership: Dealership;
   let employee: User;

   beforeEach(() => {
       jest.clearAllMocks();
       
       validator = new AddDealershipEmployeeValidator();
       useCase = new AddDealershipEmployeeUseCase(
           mockDealershipRepository,
           mockUserRepository,
           validator
       );

       // Créer l'employé valide
       employee = User.create({
           email: new Email('employee@test.com'),
           firstName: 'John',
           lastName: 'Doe',
           role: UserRole.DEALER_EMPLOYEE,
           companyId: 'dealership-123',
           hashedPassword: 'hashedPassword123'
       });

       // Créer la concession
       dealership = Dealership.create({
           name: "Test Dealership",
           address: Address.create("123 St", "City", "12345", "Country"),
           contactInfo: ContactInfo.create(
               "+1234567890",
               new Email('dealership@test.com')
           )
       });
   });

   describe('success cases', () => {
       beforeEach(() => {
           mockDealershipRepository.findById.mockResolvedValue(dealership);
           mockUserRepository.findById.mockResolvedValue(employee);
           mockDealershipRepository.update.mockResolvedValue(undefined);
           mockUserRepository.update.mockResolvedValue(undefined);
       });

       it('should add DEALER_EMPLOYEE to dealership', async () => {
           await useCase.execute({
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.DEALER_EMPLOYEE
           });

           expect(mockDealershipRepository.update).toHaveBeenCalled();
           const updatedDealership = mockDealershipRepository.update.mock.calls[0][0];
           expect(updatedDealership.hasEmployee(employee.id)).toBe(true);
       });

       it('should add TECHNICIAN to dealership', async () => {
           const dto = {
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.TECHNICIAN
           };

           await useCase.execute(dto);

           // Vérifier que le rôle a été mis à jour
           expect(mockUserRepository.update).toHaveBeenCalled();

           // Vérifier que l'employé a été ajouté
           expect(mockDealershipRepository.update).toHaveBeenCalled();
           const updatedDealership = mockDealershipRepository.update.mock.calls[0][0];
           expect(updatedDealership.hasEmployee(employee.id)).toBe(true);
       });

       it('should add STOCK_MANAGER to dealership', async () => {
           const dto = {
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.STOCK_MANAGER
           };

           await useCase.execute(dto);

           expect(mockUserRepository.update).toHaveBeenCalled();
           expect(mockDealershipRepository.update).toHaveBeenCalled();
           const updatedDealership = mockDealershipRepository.update.mock.calls[0][0];
           expect(updatedDealership.hasEmployee(employee.id)).toBe(true);
       });
   });

   describe('failure cases', () => {
       it('should throw DealershipNotFoundError if dealership does not exist', async () => {
           mockDealershipRepository.findById.mockResolvedValue(null);
           mockUserRepository.findById.mockResolvedValue(employee);

           await expect(useCase.execute({
               dealershipId: 'non-existent',
               employeeId: employee.id,
               role: UserRole.DEALER_EMPLOYEE
           }))
               .rejects
               .toThrow(DealershipNotFoundError);

           expect(mockDealershipRepository.update).not.toHaveBeenCalled();
           expect(mockUserRepository.update).not.toHaveBeenCalled();
       });

       it('should throw UserNotFoundError if user does not exist', async () => {
           mockDealershipRepository.findById.mockResolvedValue(dealership);
           mockUserRepository.findById.mockResolvedValue(null);

           await expect(useCase.execute({
               dealershipId: dealership.id,
               employeeId: 'non-existent',
               role: UserRole.DEALER_EMPLOYEE
           }))
               .rejects
               .toThrow(UserNotFoundError);

           expect(mockDealershipRepository.update).not.toHaveBeenCalled();
           expect(mockUserRepository.update).not.toHaveBeenCalled();
       });

       it('should throw DealershipValidationError for invalid role (PARTNER_EMPLOYEE)', async () => {
           mockDealershipRepository.findById.mockResolvedValue(dealership);
           mockUserRepository.findById.mockResolvedValue(employee);

           await expect(useCase.execute({
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.PARTNER_EMPLOYEE
           }))
               .rejects
               .toThrow(DealershipValidationError);

           expect(mockDealershipRepository.update).not.toHaveBeenCalled();
           expect(mockUserRepository.update).not.toHaveBeenCalled();
       });

       it('should throw DealershipValidationError for invalid role (TRIUMPH_ADMIN)', async () => {
           mockDealershipRepository.findById.mockResolvedValue(dealership);
           mockUserRepository.findById.mockResolvedValue(employee);

           await expect(useCase.execute({
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.TRIUMPH_ADMIN
           }))
               .rejects
               .toThrow(DealershipValidationError);

           expect(mockDealershipRepository.update).not.toHaveBeenCalled();
           expect(mockUserRepository.update).not.toHaveBeenCalled();
       });

       it('should validate input data', async () => {
           await expect(useCase.execute({
               dealershipId: '',
               employeeId: employee.id,
               role: UserRole.DEALER_EMPLOYEE
           }))
               .rejects
               .toThrow(DealershipValidationError);

           expect(mockDealershipRepository.update).not.toHaveBeenCalled();
           expect(mockUserRepository.update).not.toHaveBeenCalled();
       });

       it('should propagate repository errors', async () => {
           mockDealershipRepository.findById.mockResolvedValue(dealership);
           mockUserRepository.findById.mockResolvedValue(employee);
           mockDealershipRepository.update.mockRejectedValue(new Error('Database error'));

           await expect(useCase.execute({
               dealershipId: dealership.id,
               employeeId: employee.id,
               role: UserRole.DEALER_EMPLOYEE
           }))
               .rejects
               .toThrow('Database error');
       });
   });
});