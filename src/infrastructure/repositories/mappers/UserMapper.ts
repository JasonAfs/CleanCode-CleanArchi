import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';

export class UserMapper {
    public static toDomain(prismaUser: PrismaUser): User {
        const user = User.create({
            email: new Email(prismaUser.email),
            firstName: prismaUser.firstName,
            lastName: prismaUser.lastName,
            role: prismaUser.role as UserRole,
            companyId: prismaUser.companyId ?? '',
            hashedPassword: prismaUser.hashedPassword,
            dealershipId: prismaUser.dealershipId ?? ''
        });

        Object.defineProperties(user, {
            'id': { value: prismaUser.id },
            'isActive': { value: prismaUser.isActive }
        });

        return user;
    }

    public static toPrisma(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        return {
            id: user.id,
            email: user.email.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as PrismaUserRole,
            companyId: user.companyId || null,
            dealershipId: user.dealershipId,
            hashedPassword: user.getHashedPassword(),
            isActive: user.isActive
        };
    }
}