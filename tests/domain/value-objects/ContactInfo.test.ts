import { ContactInfo } from "@domain/value-objects/ContactInfo";
import { Email } from "@domain/value-objects/Email";
import { InvalidContactInfoError } from "@domain/errors/value-objects/contact/InvalidContactInfoError";

describe('ContactInfo Value Object', () => {
    let validEmail: Email;

    beforeEach(() => {
        validEmail = new Email('test@example.com');
    });

    describe('creation', () => {
        it('should create valid contact info', () => {
            const contactInfo = ContactInfo.create('+1234567890', validEmail);
            
            expect(contactInfo).toBeInstanceOf(ContactInfo);
            expect(contactInfo.phoneNumber).toBe('+1234567890');
            expect(contactInfo.emailAddress).toBe(validEmail);
        });

        describe('phone validation', () => {
            it('should throw error for empty phone', () => {
                expect(() => ContactInfo.create('', validEmail))
                    .toThrow(new InvalidContactInfoError("Phone is required"));
            });

            it('should throw error for phone with only spaces', () => {
                expect(() => ContactInfo.create('   ', validEmail))
                    .toThrow(new InvalidContactInfoError("Phone is required"));
            });

            it('should throw error for invalid phone format', () => {
                const invalidPhones = [
                    'abc',                  // Lettres
                    '123',                  // Trop court
                    '++1234567890',         // Double plus
                    '12345678901234567890'  // Trop long
                ];

                invalidPhones.forEach(phone => {
                    expect(() => ContactInfo.create(phone, validEmail))
                        .toThrow(new InvalidContactInfoError("Invalid phone format"));
                });
            });

            it('should accept valid phone formats', () => {
                const validPhones = [
                    '+1234567890',      // Format international avec +
                    '1234567890',       // Format simple
                    '(123)4567890',     // Format avec parenthèses
                    '123-456-7890',     // Format avec tirets
                    '123.456.7890'      // Format avec points
                ];

                validPhones.forEach(phone => {
                    expect(() => ContactInfo.create(phone, validEmail)).not.toThrow();
                });
            });
        });
    });

    describe('getters', () => {
        it('should return phone number', () => {
            const phone = '+1234567890';
            const contactInfo = ContactInfo.create(phone, validEmail);
            expect(contactInfo.phoneNumber).toBe(phone);
        });

        it('should return email', () => {
            const contactInfo = ContactInfo.create('+1234567890', validEmail);
            expect(contactInfo.emailAddress).toBe(validEmail);
        });
    });

    describe('immutability', () => {
        it('should create new instance when modifying phone', () => {
            const contactInfo1 = ContactInfo.create('+1234567890', validEmail);
            const contactInfo2 = ContactInfo.create('+0987654321', validEmail);

            expect(contactInfo1.phoneNumber).not.toBe(contactInfo2.phoneNumber);
        });

        it('should create new instance when modifying email', () => {
            const email2 = new Email('other@example.com');
            const contactInfo1 = ContactInfo.create('+1234567890', validEmail);
            const contactInfo2 = ContactInfo.create('+1234567890', email2);

            expect(contactInfo1.emailAddress).not.toBe(contactInfo2.emailAddress);
        });
    });
});