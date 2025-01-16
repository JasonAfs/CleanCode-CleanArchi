import { UserRole } from '@domain/enums/UserRole';

export interface AuthorizationContext {
  userId: string;
  userRole: UserRole;
  dealershipId?: string; // Pour les employés de concession
  companyId?: string; // Pour les employés d'entreprise
  resourceId?: string; // ID de la ressource accédée
  resourceType?: string; // Type de ressource (moto, maintenance, etc.)
}
