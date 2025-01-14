import { CreateDealershipUseCase } from "@application/use-cases/dealership/CreateDealershipUseCase";
import { CreateDealershipValidator } from "@application/validation/dealership/CreateDealershipValidator";
import { IDealershipRepository } from "@application/ports/repositories/IDealershipRepository";
import { CreateDealershipDTO } from "@application/dtos/dealership/CreateDealershipDTO";
import { DealershipAlreadyExistsError } from "@domain/errors/dealership/DealershipAlreadyExistsError";
import { Dealership } from "@domain/entities/DealershipEntity";

// Mock du repository
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

describe('CreateDealershipUseCase', () => {
   let useCase: CreateDealershipUseCase;
   let validator: CreateDealershipValidator;

   const validCreateDealershipDTO: CreateDealershipDTO = {
       name: "Test Dealership",
       street: "123 Test St",
       city: "Test City",
       postalCode: "12345",
       country: "Test Country",
       phone: "+1234567890",
       email: "test@dealer.com"
   };

   beforeEach(() => {
       jest.clearAllMocks();
       validator = new CreateDealershipValidator();
       useCase = new CreateDealershipUseCase(
           mockDealershipRepository,
           validator
       );

       // Configuration par défaut des mocks
       mockDealershipRepository.exists.mockResolvedValue(false);
       mockDealershipRepository.create.mockResolvedValue(undefined);
   });

   describe('success cases', () => {
       it('should create a new dealership with valid data', async () => {
           const dealership = await useCase.execute(validCreateDealershipDTO);

           expect(dealership).toBeDefined();
           expect(dealership.name).toBe(validCreateDealershipDTO.name);
           expect(dealership.address.toString()).toContain(validCreateDealershipDTO.street);
           expect(dealership.contactInfo.emailAddress.toString()).toBe(validCreateDealershipDTO.email);
           expect(dealership.contactInfo.phoneNumber).toBe(validCreateDealershipDTO.phone);
           expect(dealership.isActive).toBe(true);
           expect(dealership.id).toBeDefined();

           // Vérification des appels au repository
           expect(mockDealershipRepository.exists).toHaveBeenCalledWith(validCreateDealershipDTO.name);
           expect(mockDealershipRepository.create).toHaveBeenCalledWith(expect.any(Dealership));
       });
   });

   describe('failure cases', () => {
       it('should throw DealershipAlreadyExistsError if name already exists', async () => {
           mockDealershipRepository.exists.mockResolvedValue(true);

           await expect(useCase.execute(validCreateDealershipDTO))
               .rejects
               .toThrow(DealershipAlreadyExistsError);

           expect(mockDealershipRepository.create).not.toHaveBeenCalled();
       });

       it('should validate input data', async () => {
           const invalidDTO = {
               ...validCreateDealershipDTO,
               name: ''  // Invalid name
           };

           await expect(useCase.execute(invalidDTO))
               .rejects
               .toThrow();
               
           expect(mockDealershipRepository.exists).not.toHaveBeenCalled();
           expect(mockDealershipRepository.create).not.toHaveBeenCalled();
       });

       it('should propagate repository errors', async () => {
           const error = new Error('Database error');
           mockDealershipRepository.create.mockRejectedValue(error);

           await expect(useCase.execute(validCreateDealershipDTO))
               .rejects
               .toThrow(error);
       });
   });
});