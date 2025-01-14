import { DomainError } from "@domain/errors/DomainError";

export class InvalidRegistrationNumberError extends DomainError {
    constructor(message: string) {
        super(`Invalid registration number: ${message}`);
    }
}