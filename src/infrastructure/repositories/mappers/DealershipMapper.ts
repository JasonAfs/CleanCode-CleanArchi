import { Dealership as PrismaDealership, User as PrismaUser, Motorcycle as PrismaMotorcycle } from '@prisma/client';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { UserMapper } from './UserMapper';
import { MotorcycleMapper } from './MotorcycleMapper';

export class DealershipMapper {
    public static toDomain(prismaDealership: PrismaDealership & { 
        employees?: PrismaUser[],
        motorcycles?: PrismaMotorcycle[]
    }): Dealership {
        const dealership = Dealership.create({
            name: prismaDealership.name,
            address: Address.create(
                prismaDealership.street,
                prismaDealership.city,
                prismaDealership.postalCode,
                prismaDealership.country
            ),
            contactInfo: ContactInfo.create(
                prismaDealership.phone,
                new Email(prismaDealership.email)
            )
        });

        // Initialiser l'agrégat des employés
        let employeesAggregate = DealershipEmployees.create();
        if (prismaDealership.employees?.length) {
            for (const employee of prismaDealership.employees) {
                const userEntity = UserMapper.toDomain(employee);
                employeesAggregate = employeesAggregate.addEmployee(userEntity);
            }
        }

        // Mapper les motos
        const motorcycles = prismaDealership.motorcycles?.map(MotorcycleMapper.toDomain) || [];

        Object.defineProperties(dealership, {
            'id': { value: prismaDealership.id },
            'isActive': { value: prismaDealership.isActive },
            'createdAt': { value: prismaDealership.createdAt },
            'updatedAt': { value: prismaDealership.updatedAt },
            'employees': { value: employeesAggregate },
            'motorcycles': { value: motorcycles }
        });

        return dealership;
    }

    public static toPrisma(dealership: Dealership): Omit<PrismaDealership, 'createdAt' | 'updatedAt'> {
        return {
            id: dealership.id,
            name: dealership.name,
            street: dealership.address.street,
            city: dealership.address.city,
            postalCode: dealership.address.postalCode,
            country: dealership.address.country,
            phone: dealership.contactInfo.phoneNumber,
            email: dealership.contactInfo.emailAddress.toString(),
            isActive: dealership.isActive
        };
    }
}