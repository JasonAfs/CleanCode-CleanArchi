import { PrismaClient, UserRole as PrismaUserRole } from '@prisma/client';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { User } from '@domain/entities/UserEntity';
import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';
import { UserMapper } from '../mappers/UserMapper';

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(user: User): Promise<void> {
        const prismaUser = UserMapper.toPrisma(user);
        await this.prisma.user.create({
            data: prismaUser
        });
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByEmail(email: Email): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toString() }
        });
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByCompanyId(companyId: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { companyId }
        });
        return users.map(UserMapper.toDomain);
    }

    async update(user: User): Promise<void> {
        const prismaUser = UserMapper.toPrisma(user);
        await this.prisma.user.update({
            where: { id: user.id },
            data: prismaUser
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id }
        });
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users.map(UserMapper.toDomain);
    }

    async findActive(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { isActive: true }
        });
        return users.map(UserMapper.toDomain);
    }

    async findByRole(role: UserRole): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { role: role as PrismaUserRole }
        });
        return users.map(UserMapper.toDomain);
    }

    async exists(email: Email): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { email: email.toString() }
        });
        return count > 0;
    }
}