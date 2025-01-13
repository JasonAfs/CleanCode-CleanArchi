import { DomainError } from "@domain/errors/DomainError";

export class InvalidContactInfoError extends DomainError {
    constructor(message: string) {
        super(`Invalid contact information: ${message}`);
    }
}