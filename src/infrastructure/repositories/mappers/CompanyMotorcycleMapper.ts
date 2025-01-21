import { CompanyMotorcycle as PrismaCompanyMotorcycle } from '@prisma/client';
import { CompanyMotorcycle } from '@domain/entities/CompanyMotorcycleEntity';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';

export class CompanyMotorcycleMapper {
    public static toDomain(prismaCompanyMotorcycle: PrismaCompanyMotorcycle): CompanyMotorcycle {
        const dummyMotorcycle = {
            id: prismaCompanyMotorcycle.motorcycleId,
            isAvailable: () => true
        } as Motorcycle;

        const assignment = CompanyMotorcycle.assign(
            prismaCompanyMotorcycle.companyId,
            dummyMotorcycle
        );

        // Définir les propriétés qui ne peuvent pas être modifiées après la création
        Object.defineProperties(assignment, {
            'id': { value: prismaCompanyMotorcycle.id },
            'assignedAt': { value: prismaCompanyMotorcycle.assignedAt },
            'isActive': { value: prismaCompanyMotorcycle.isActive },
            'createdAt': { value: prismaCompanyMotorcycle.createdAt },
            'updatedAt': { value: prismaCompanyMotorcycle.updatedAt }
        });

        return assignment;
    }

    public static toPrisma(companyMotorcycle: CompanyMotorcycle): Omit<PrismaCompanyMotorcycle, 'createdAt' | 'updatedAt'> {
        return {
            id: companyMotorcycle.id,
            companyId: companyMotorcycle.companyId,
            motorcycleId: companyMotorcycle.motorcycleId,
            assignedAt: companyMotorcycle.assignedAt,
            isActive: companyMotorcycle.isActive
        };
    }
}