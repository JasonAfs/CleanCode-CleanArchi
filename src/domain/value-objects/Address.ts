import { InvalidAddressError } from '@domain/errors/value-objects/address/InvalidAddressError';

export class Address {
  private constructor(
    private readonly _street: string,
    private readonly _city: string,
    private readonly _postalCode: string,
    private readonly _country: string,
  ) {}

  public static create(
    street: string,
    city: string,
    postalCode: string,
    country: string,
  ): Address {
    if (!street.trim()) {
      throw new InvalidAddressError('Street is required');
    }
    if (!city.trim()) {
      throw new InvalidAddressError('City is required');
    }
    if (!postalCode.trim()) {
      throw new InvalidAddressError('Postal code is required');
    }
    if (!country.trim()) {
      throw new InvalidAddressError('Country is required');
    }

    return new Address(
      street.trim(),
      city.trim(),
      postalCode.trim(),
      country.trim(),
    );
  }

  // Ajout des getters
  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get country(): string {
    return this._country;
  }

  public toString(): string {
    return `${this._street}, ${this._city}, ${this._postalCode}, ${this._country}`;
  }
}
