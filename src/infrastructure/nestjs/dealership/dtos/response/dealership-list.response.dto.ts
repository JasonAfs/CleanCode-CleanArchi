import { Dealership } from '@domain/entities/DealershipEntity';

export class DealershipListResponseDTO {
    id!: string;
    name!: string;
    address!: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    contact!: {
        phone: string;
        email: string;
    };
    employeeCount!: number;
    isActive!: boolean;

    constructor(dealership: Dealership) {
        this.id = dealership.id;
        this.name = dealership.name;
        this.address = {
            street: dealership.address.street,
            city: dealership.address.city,
            postalCode: dealership.address.postalCode,
            country: dealership.address.country
        };
        this.contact = {
            phone: dealership.contactInfo.phoneNumber,
            email: dealership.contactInfo.emailAddress.toString()
        };
        this.employeeCount = dealership.employees.getAll().length;
        this.isActive = dealership.isActive;
    }

    static fromDomain(dealership: Dealership): DealershipListResponseDTO {
        return new DealershipListResponseDTO(dealership);
    }
}