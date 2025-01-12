import { Email } from '@domain/value-objects/Email';
import { InvalidEmailError } from '@domain/errors/user/InvalidEmailError';

describe('Email Value Object', () => {
    describe('creation', () => {
        it('should create a valid email', () => {
            const emailAddress = 'test@example.com';
            const email = new Email(emailAddress);
            expect(email.toString()).toBe(emailAddress);
        });

        it('should throw InvalidEmailError for empty email', () => {
            expect(() => new Email('')).toThrow(InvalidEmailError);
        });

        it('should throw InvalidEmailError for email without @', () => {
            expect(() => new Email('testexample.com')).toThrow(InvalidEmailError);
        });

        it('should throw InvalidEmailError for email without domain', () => {
            expect(() => new Email('test@')).toThrow(InvalidEmailError);
        });

        it('should throw InvalidEmailError for email with spaces', () => {
            expect(() => new Email('test @ example.com')).toThrow(InvalidEmailError);
        });

        it('should throw InvalidEmailError for email without TLD', () => {
            expect(() => new Email('test@example')).toThrow(InvalidEmailError);
        });
    });

    describe('methods', () => {
        it('toString should return the email string', () => {
            const emailAddress = 'test@example.com';
            const email = new Email(emailAddress);
            expect(email.toString()).toBe(emailAddress);
        });
    });

    describe('comparison', () => {
        it('two emails with same value should be considered equal', () => {
            const email1 = new Email('test@example.com');
            const email2 = new Email('test@example.com');
            expect(email1.toString()).toBe(email2.toString());
        });

        it('two emails with different values should be considered different', () => {
            const email1 = new Email('test1@example.com');
            const email2 = new Email('test2@example.com');
            expect(email1.toString()).not.toBe(email2.toString());
        });
    });
});