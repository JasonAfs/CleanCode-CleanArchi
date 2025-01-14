// tests/application/validation/dealership/CreateDealershipValidator.test.ts
import { CreateDealershipValidator } from "@application/validation/dealership/CreateDealershipValidator";
import { CreateDealershipDTO } from "@application/dtos/dealership/CreateDealershipDTO";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";

describe('CreateDealershipValidator', () => {
   let validator: CreateDealershipValidator;
   let validDto: CreateDealershipDTO;

   beforeEach(() => {
       validator = new CreateDealershipValidator();
       validDto = {
           name: "Test Dealership",
           street: "123 Test St",
           city: "Test City",
           postalCode: "12345",
           country: "Test Country",
           phone: "+1234567890",
           email: "test@dealer.com"
       };
   });

   it('should pass validation with valid data', () => {
       expect(() => validator.validate(validDto)).not.toThrow();
   });

   describe('name validation', () => {
       it('should throw error for empty name', () => {
           validDto.name = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Name is required'));
       });

       it('should throw error for name with only spaces', () => {
           validDto.name = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Name is required'));
       });
   });

   describe('street validation', () => {
       it('should throw error for empty street', () => {
           validDto.street = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Street is required'));
       });

       it('should throw error for street with only spaces', () => {
           validDto.street = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Street is required'));
       });
   });

   describe('city validation', () => {
       it('should throw error for empty city', () => {
           validDto.city = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('City is required'));
       });

       it('should throw error for city with only spaces', () => {
           validDto.city = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('City is required'));
       });
   });

   describe('postal code validation', () => {
       it('should throw error for empty postal code', () => {
           validDto.postalCode = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Postal code is required'));
       });

       it('should throw error for postal code with only spaces', () => {
           validDto.postalCode = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Postal code is required'));
       });
   });

   describe('country validation', () => {
       it('should throw error for empty country', () => {
           validDto.country = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Country is required'));
       });

       it('should throw error for country with only spaces', () => {
           validDto.country = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Country is required'));
       });
   });

   describe('phone validation', () => {
       it('should throw error for empty phone', () => {
           validDto.phone = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Phone is required'));
       });

       it('should throw error for phone with only spaces', () => {
           validDto.phone = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Phone is required'));
       });
   });

   describe('email validation', () => {
       it('should throw error for empty email', () => {
           validDto.email = '';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Email is required'));
       });

       it('should throw error for email with only spaces', () => {
           validDto.email = '   ';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Email is required'));
       });

       it('should throw error for invalid email format', () => {
           validDto.email = 'invalid-email';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Invalid email format'));
       });

       it('should throw error for email without domain', () => {
           validDto.email = 'test@';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Invalid email format'));
       });

       it('should throw error for email without TLD', () => {
           validDto.email = 'test@example';
           expect(() => validator.validate(validDto))
               .toThrow(new DealershipValidationError('Invalid email format'));
       });
   });
});