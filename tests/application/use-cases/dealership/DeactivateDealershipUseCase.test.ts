import { DeactivateDealershipUseCase } from "@application/use-cases/dealership/DeactivateDealershipUseCase";
import { DeactivateDealershipValidator } from "@application/validation/dealership/DeactivateDealershipValidator";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { DealershipNotFoundError } from "@domain/errors/dealership/DealershipNotFoundError";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { Dealership } from "@domain/entities/DealershipEntity";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { Email } from "@domain/value-objects/Email";

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

describe('DeactivateDealershipUseCase', () => {
    let useCase: DeactivateDealershipUseCase;
    let validator: DeactivateDealershipValidator;
    let dealership: Dealership;

    beforeEach(() => {
        validator = new DeactivateDealershipValidator();
        useCase = new DeactivateDealershipUseCase(
            mockDealershipRepository,
            validator
        );

        dealership = Dealership.create({
            name: "Test Dealership",
            address: Address.create("123 St", "City", "12345", "Country"),
            contactInfo: ContactInfo.create(
                "+1234567890",
                new Email('dealership@test.com')
            )
        });

        mockDealershipRepository.findById.mockResolvedValue(dealership);
        mockDealershipRepository.update.mockResolvedValue(undefined);
    });

    describe('success cases', () => {
        it('should deactivate an active dealership', async () => {
            await useCase.execute({ dealershipId: dealership.id });

            expect(mockDealershipRepository.update).toHaveBeenCalled();
            const updatedDealership = mockDealershipRepository.update.mock.calls[0][0];
            expect(updatedDealership.isActive).toBe(false);
        });
    });

    describe('failure cases', () => {
        it('should throw DealershipNotFoundError if dealership does not exist', async () => {
            mockDealershipRepository.findById.mockResolvedValue(null);

            await expect(useCase.execute({ dealershipId: 'non-existent' }))
                .rejects
                .toThrow(DealershipNotFoundError);
        });

        it('should validate input data', async () => {
            await expect(useCase.execute({ dealershipId: '' }))
                .rejects
                .toThrow(DealershipValidationError);
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockDealershipRepository.update.mockRejectedValue(error);

            await expect(useCase.execute({ dealershipId: dealership.id }))
                .rejects
                .toThrow(error);
        });
    });
});