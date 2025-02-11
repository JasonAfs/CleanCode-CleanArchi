// src/infrastructure/nestjs/dealership/dtos/response/dealership.response.dto.ts
import { Dealership } from '@domain/entities/DealershipEntity';

export class DealershipResponseDTO {
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
  employees!: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(dealership: Dealership) {
    this.id = dealership.id;
    this.name = dealership.name;
    this.address = {
      street: dealership.address.street,
      city: dealership.address.city,
      postalCode: dealership.address.postalCode,
      country: dealership.address.country,
    };
    this.contact = {
      phone: dealership.contactInfo.phoneNumber,
      email: dealership.contactInfo.emailAddress.toString(),
    };
    this.employees = dealership.employees.getAll().map((employee) => ({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email.toString(),
      role: employee.role,
    }));
    this.isActive = dealership.isActive;
    this.createdAt = dealership.createdAt;
    this.updatedAt = dealership.updatedAt;
  }

  static fromDomain(dealership: Dealership): DealershipResponseDTO {
    return new DealershipResponseDTO(dealership);
  }
}
