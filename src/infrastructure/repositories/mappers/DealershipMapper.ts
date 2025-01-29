import { Dealership as PrismaDealership, User as PrismaUser, Motorcycle as PrismaMotorcycle } from '@prisma/client';
import { Dealership } from '@domain/entities/DealershipEntity';
import { Address } from '@domain/value-objects/Address';
import { ContactInfo } from '@domain/value-objects/ContactInfo';
import { Email } from '@domain/value-objects/Email';
import { DealershipEmployees } from '@domain/aggregates/dealership/DealershipEmployees';
import { UserMapper } from './UserMapper';
import { MotorcycleMapper } from './MotorcycleMapper';

export class DealershipMapper {
    /**
     * Convertit une entité Prisma en entité de domaine
     */
    public static toDomain(prismaDealership: PrismaDealership & { 
        employees?: PrismaUser[],
        motorcycles?: PrismaMotorcycle[]
    }): Dealership {
        // Reconstituer l'agrégat des employés
        let employees = DealershipEmployees.create();
        if (prismaDealership.employees?.length) {
            for (const employee of prismaDealership.employees) {
                const userEntity = UserMapper.toDomain(employee);
                employees = employees.addEmployee(userEntity);
            }
        }

        // Mapper les motos
        const motorcycles = prismaDealership.motorcycles?.map(MotorcycleMapper.toDomain) || [];

        // Utiliser la méthode reconstitute pour créer l'entité
        return Dealership.reconstitute({
            id: prismaDealership.id,
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
            ),
            isActive: prismaDealership.isActive,
            createdAt: prismaDealership.createdAt,
            updatedAt: prismaDealership.updatedAt
        }, employees, motorcycles);
    }

    /**
     * Convertit une entité de domaine en objet Prisma pour la création
     */
    public static toPrismaCreate(dealership: Dealership): any {
        return {
            id: dealership.id,
            name: dealership.name,
            street: dealership.address.street,
            city: dealership.address.city,
            postalCode: dealership.address.postalCode,
            country: dealership.address.country,
            phone: dealership.contactInfo.phoneNumber,
            email: dealership.contactInfo.emailAddress.toString(),
            isActive: dealership.isActive,
            // Pas de relations lors de la création initiale
        };
    }

    /**
     * Convertit une entité de domaine en objet Prisma pour la mise à jour
     */
    public static toPrismaUpdate(dealership: Dealership): any {
        return {
            name: dealership.name,
            street: dealership.address.street,
            city: dealership.address.city,
            postalCode: dealership.address.postalCode,
            country: dealership.address.country,
            phone: dealership.contactInfo.phoneNumber,
            email: dealership.contactInfo.emailAddress.toString(),
            isActive: dealership.isActive,
            // Gestion des relations pour la mise à jour
            employees: {
                connect: dealership.employees.getAll().map(employee => ({
                    id: employee.id
                }))
            }
        };
    }
}