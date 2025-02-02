import { Request } from 'express';
import { UserRole } from '@domain/enums/UserRole';

export interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        role: UserRole;
        dealershipId?: string;
        companyId?: string;
    };
}