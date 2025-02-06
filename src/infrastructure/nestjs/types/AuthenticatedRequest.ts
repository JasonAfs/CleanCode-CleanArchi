import { Request } from 'express';
import { UserRole } from '@domain/enums/UserRole';

export interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        role: UserRole;
        userDealershipId?: string;
        userCompanyId?: string;
    };
}