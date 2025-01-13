import { DomainError } from "@domain/errors/DomainError";

export class InvalidAddressError extends DomainError {
    constructor(message: string) {
        super(`Invalid address: ${message}`);
    }
}