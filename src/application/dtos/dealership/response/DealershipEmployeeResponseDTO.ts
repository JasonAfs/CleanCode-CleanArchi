import { UserRole } from "@domain/enums/UserRole";

export interface DealershipEmployeeResponseDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}
