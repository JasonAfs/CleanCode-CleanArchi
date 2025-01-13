import { InvalidAddressError } from "@domain/errors/value-objects/address/InvalidAddressError";

export class Address {
    private constructor(
        private readonly street: string,
        private readonly city: string,
        private readonly postalCode: string,
        private readonly country: string
    ) {}

    public static create(street: string, city: string, postalCode: string, country: string): Address {
        if (!street.trim()) {
            throw new InvalidAddressError("Street is required");
        }
        if (!city.trim()) {
            throw new InvalidAddressError("City is required");
        }
        if (!postalCode.trim()) {
            throw new InvalidAddressError("Postal code is required");
        }
        if (!country.trim()) {
            throw new InvalidAddressError("Country is required");
        }

        return new Address(
            street.trim(),
            city.trim(),
            postalCode.trim(),
            country.trim()
        );
    }

    public toString(): string {
        return `${this.street}, ${this.postalCode} ${this.city}, ${this.country}`;
    }
}
