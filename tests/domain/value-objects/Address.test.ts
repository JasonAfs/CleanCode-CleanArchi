// tests/domain/value-objects/Address.test.ts
import { Address } from "@domain/value-objects/Address";
import { InvalidAddressError } from "@domain/errors/value-objects/address/InvalidAddressError";

describe('Address Value Object', () => {
    const validAddressProps = {
        street: "123 Test Street",
        city: "Test City",
        postalCode: "12345",
        country: "Test Country"
    };

    describe('creation', () => {
        it('should create a valid address', () => {
            const address = Address.create(
                validAddressProps.street,
                validAddressProps.city,
                validAddressProps.postalCode,
                validAddressProps.country
            );

            expect(address).toBeInstanceOf(Address);
            expect(address.toString()).toBe(
                `${validAddressProps.street}, ${validAddressProps.postalCode} ${validAddressProps.city}, ${validAddressProps.country}`
            );
        });

        describe('street validation', () => {
            it('should throw error for empty street', () => {
                expect(() => Address.create(
                    '',
                    validAddressProps.city,
                    validAddressProps.postalCode,
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("Street is required"));
            });

            it('should throw error for street with only spaces', () => {
                expect(() => Address.create(
                    '   ',
                    validAddressProps.city,
                    validAddressProps.postalCode,
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("Street is required"));
            });
        });

        describe('city validation', () => {
            it('should throw error for empty city', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    '',
                    validAddressProps.postalCode,
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("City is required"));
            });

            it('should throw error for city with only spaces', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    '   ',
                    validAddressProps.postalCode,
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("City is required"));
            });
        });

        describe('postal code validation', () => {
            it('should throw error for empty postal code', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    validAddressProps.city,
                    '',
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("Postal code is required"));
            });

            it('should throw error for postal code with only spaces', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    validAddressProps.city,
                    '   ',
                    validAddressProps.country
                )).toThrow(new InvalidAddressError("Postal code is required"));
            });
        });

        describe('country validation', () => {
            it('should throw error for empty country', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    validAddressProps.city,
                    validAddressProps.postalCode,
                    ''
                )).toThrow(new InvalidAddressError("Country is required"));
            });

            it('should throw error for country with only spaces', () => {
                expect(() => Address.create(
                    validAddressProps.street,
                    validAddressProps.city,
                    validAddressProps.postalCode,
                    '   '
                )).toThrow(new InvalidAddressError("Country is required"));
            });
        });
    });

    describe('formatting', () => {
        it('should trim all fields', () => {
            const address = Address.create(
                " 123 Test Street ",
                " Test City ",
                " 12345 ",
                " Test Country "
            );

            expect(address.toString()).toBe("123 Test Street, 12345 Test City, Test Country");
        });

        it('should format address correctly', () => {
            const address = Address.create(
                validAddressProps.street,
                validAddressProps.city,
                validAddressProps.postalCode,
                validAddressProps.country
            );

            expect(address.toString()).toBe(
                `${validAddressProps.street}, ${validAddressProps.postalCode} ${validAddressProps.city}, ${validAddressProps.country}`
            );
        });
    });
});