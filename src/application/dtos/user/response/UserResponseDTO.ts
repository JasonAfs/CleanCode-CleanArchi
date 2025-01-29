import { UserRole } from "@domain/enums/UserRole";

export interface UserResponseDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}