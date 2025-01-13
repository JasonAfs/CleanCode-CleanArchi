import { DomainError } from "../DomainError";

export class DealershipValidationError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}