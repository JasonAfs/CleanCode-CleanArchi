// tests/domain/entities/DealershipEntity.test.ts
import { Dealership } from "@domain/entities/DealershipEntity";
import { Address } from "@domain/value-objects/Address";
import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { Email } from "@domain/value-objects/Email";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";
import { User } from "@domain/entities/UserEntity";
import { UserRole } from "@domain/enums/UserRole";

describe('Dealership Entity', () => {
    let validProps: {
        name: string;
        address: Address;
        contactInfo: ContactInfo;
    };

    beforeEach(() => {
        validProps = {
            name: "Test Dealership",
            address: Address.create("123 St", "City", "12345", "Country"),
            contactInfo: ContactInfo.create(
                "+1234567890",
                new Email('test@dealership.com')
            )
        };
    });

    describe('creation', () => {
        it('should create valid dealership', () => {
            const dealership = Dealership.create(validProps);

            expect(dealership.id).toBeDefined();
            expect(dealership.name).toBe(validProps.name);
            expect(dealership.address).toBe(validProps.address);
            expect(dealership.contactInfo).toBe(validProps.contactInfo);
            expect(dealership.isActive).toBe(true);
            expect(dealership.createdAt).toBeInstanceOf(Date);
            expect(dealership.updatedAt).toBeInstanceOf(Date);
        });

        it('should throw error for empty name', () => {
            expect(() => Dealership.create({
                ...validProps,
                name: ''
            })).toThrow(DealershipValidationError);
        });
    });

    describe('business methods', () => {
        let dealership: Dealership;
        
        beforeEach(() => {
            dealership = Dealership.create(validProps);
        });

        describe('status management', () => {
            it('should deactivate dealership', () => {
                dealership.deactivate();
                expect(dealership.isActive).toBe(false);
            });

            it('should activate dealership', () => {
                dealership.deactivate();
                dealership.activate();
                expect(dealership.isActive).toBe(true);
            });
        });

        describe('information updates', () => {
            it('should update contact info', () => {
                const newContactInfo = ContactInfo.create(
                    "+0987654321",
                    new Email('new@dealership.com')
                );
                dealership.updateContactInfo(newContactInfo);
                expect(dealership.contactInfo).toBe(newContactInfo);
            });

            it('should update address', () => {
                const newAddress = Address.create(
                    "456 St",
                    "New City",
                    "54321",
                    "New Country"
                );
                dealership.updateAddress(newAddress);
                expect(dealership.address).toBe(newAddress);
            });

            it('should update name', () => {
                const newName = "New Dealership Name";
                dealership.updateName(newName);
                expect(dealership.name).toBe(newName);
            });

            it('should throw error when updating to empty name', () => {
                expect(() => dealership.updateName('')).toThrow(DealershipValidationError);
            });
        });
    });
});