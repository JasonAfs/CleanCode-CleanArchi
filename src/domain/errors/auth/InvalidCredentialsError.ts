import { DomainError } from "@domain/errors/DomainError";

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super("Invalid email or password");
    }
}