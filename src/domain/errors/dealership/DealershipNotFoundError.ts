import { DomainError } from "@domain/errors/DomainError";

export class DealershipNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`Dealership not found with identifier: ${identifier}`);
    }
}