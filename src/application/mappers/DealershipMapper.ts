import { Dealership } from '@domain/entities/DealershipEntity';
import { DealershipResponseDTO } from '../dtos/dealership/response/DealershipResponseDTO';
import { DealershipWithEmployeesDTO } from '../dtos/dealership/response/DealershipWithEmployeesDTO';

export class DealershipMapper {
  public static toDTO(dealership: Dealership): DealershipResponseDTO {
    return {
      id: dealership.id,
      name: dealership.name,
      address: {
        street: dealership.address.street,
        city: dealership.address.city,
        postalCode: dealership.address.postalCode,
        country: dealership.address.country,
      },
      contactInfo: {
        phoneNumber: dealership.contactInfo.phoneNumber,
        email: dealership.contactInfo.emailAddress.toString(),
      },
      isActive: dealership.isActive,
      createdAt: dealership.createdAt,
      updatedAt: dealership.updatedAt,
    };
  }

  public static toDTOWithEmployees(
    dealership: Dealership,
  ): DealershipWithEmployeesDTO {
    const employees = dealership.employees.getAll().map((employee) => ({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email.toString(),
      role: employee.role,
      isActive: employee.isActive,
    }));

    return {
      id: dealership.id,
      name: dealership.name,
      address: {
        street: dealership.address.street,
        city: dealership.address.city,
        postalCode: dealership.address.postalCode,
        country: dealership.address.country,
      },
      contactInfo: {
        phoneNumber: dealership.contactInfo.phoneNumber,
        email: dealership.contactInfo.emailAddress.toString(),
      },
      employees,
      isActive: dealership.isActive,
    };
  }
}
