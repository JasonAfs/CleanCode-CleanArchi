import { Email } from '@domain/value-objects/Email';
import { UserRole } from '@domain/enums/UserRole';

export interface IUserProps {
    id: string;
    email: Email;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyId: string;
    isActive: boolean;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
    dealershipId?: string | null;
}