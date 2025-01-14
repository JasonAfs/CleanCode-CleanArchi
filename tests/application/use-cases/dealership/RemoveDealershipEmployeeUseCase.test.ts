import { RemoveDealershipEmployeeUseCase } from "@application/use-cases/dealership/RemoveDealershipEmployeeUseCase";
import { RemoveDealershipEmployeeValidator } from "@application/validation/dealership/RemoveDealershipEmployeeValidator";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
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

describe('RemoveDealershipEmployeeUseCase', () => {
    let useCase: RemoveDealershipEmployeeUseCase;
    let validator: RemoveDealershipEmployeeValidator;
    let dealership: Dealership;
    let employee: User;

    beforeEach(() => {
        validator = new RemoveDealershipEmployeeValidator();
        useCase = new RemoveDealershipEmployeeUseCase(
            mockDealershipRepository,
            validator
        );

        // Créer un employé valide
        employee = User.create({
            email: new Email('employee@test.com'),
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.DEALER_EMPLOYEE,
            companyId: 'dealership-123',
            hashedPassword: 'hashedPassword123'
        });

        // Créer une concession avec l'employé
        dealership = Dealership.create({
            name: "Test Dealership",
            address: Address.create("123 St", "City", "12345", "Country"),
            contactInfo: ContactInfo.create(
                "+1234567890",
                new Email('dealership@test.com')
            )
        });
        dealership.addEmployee(employee);

        // Configuration des mocks
        mockDealershipRepository.findById.mockResolvedValue(dealership);
        mockDealershipRepository.update.mockResolvedValue(undefined);
    });

    describe('success cases', () => {
        it('should remove employee from dealership', async () => {
            await useCase.execute({
                dealershipId: dealership.id,
                employeeId: employee.id
            });

            expect(mockDealershipRepository.update).toHaveBeenCalled();
            const updatedDealership = mockDealershipRepository.update.mock.calls[0][0];
            expect(updatedDealership.hasEmployee(employee.id)).toBe(false);
        });
    });

    describe('failure cases', () => {
        it('should throw DealershipNotFoundError if dealership does not exist', async () => {
            mockDealershipRepository.findById.mockResolvedValue(null);

            await expect(useCase.execute({
                dealershipId: 'non-existent',
                employeeId: employee.id
            }))
                .rejects
                .toThrow(DealershipNotFoundError);
        });

        it('should throw DealershipValidationError if employee not found in dealership', async () => {
            await expect(useCase.execute({
                dealershipId: dealership.id,
                employeeId: 'non-existent'
            }))
                .rejects
                .toThrow(DealershipValidationError);
        });

        it('should validate input data', async () => {
            await expect(useCase.execute({
                dealershipId: '',
                employeeId: employee.id
            }))
                .rejects
                .toThrow(DealershipValidationError);
        });
    });
});