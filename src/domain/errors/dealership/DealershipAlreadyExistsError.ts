import { DomainError } from "@domain/errors/DomainError";

export class DealershipAlreadyExistsError extends DomainError {
    constructor(name: string) {
        super(`Dealership with name ${name} already exists`);
    }
}