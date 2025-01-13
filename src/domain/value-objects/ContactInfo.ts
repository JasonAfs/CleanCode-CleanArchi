import { Email } from "./Email";
import { InvalidContactInfoError } from "@domain/errors/value-objects/contact/InvalidContactInfoError";

export class ContactInfo {
    private constructor(
        private readonly phone: string,
        private readonly email: Email,
    ) {}

    public static create(phone: string, email: Email): ContactInfo {
        if (!phone.trim()) {
            throw new InvalidContactInfoError("Phone is required");
        }
        
        // Validation basique du format de téléphone
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(phone.trim())) {
            throw new InvalidContactInfoError("Invalid phone format");
        }

        return new ContactInfo(phone.trim(), email);
    }

    get phoneNumber(): string {
        return this.phone;
    }

    get emailAddress(): Email {
        return this.email;
    }
}