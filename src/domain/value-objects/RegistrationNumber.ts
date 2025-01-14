import { InvalidRegistrationNumberError } from "@domain/errors/value-objects/registration/InvalidRegistrationNumberError";

export class RegistrationNumber {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): RegistrationNumber {
        if (!value?.trim()) {
            throw new InvalidRegistrationNumberError("Registration number is required");
        }

        // Format validation for SIRET (14 digits)
        const siretRegex = /^\d{14}$/;
        if (!siretRegex.test(value.trim())) {
            throw new InvalidRegistrationNumberError("Registration number must be exactly 14 digits");
        }

        return new RegistrationNumber(value.trim());
    }

    public toString(): string {
        return this.value;
    }

    public equals(other: RegistrationNumber): boolean {
        return this.value === other.value;
    }
}