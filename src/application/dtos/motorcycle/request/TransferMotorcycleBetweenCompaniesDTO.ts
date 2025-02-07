import { BaseAuthenticatedDTO } from '../../shared/BaseAuthenticatedDTO';

export interface TransferMotorcycleBetweenCompaniesDTO extends BaseAuthenticatedDTO {
    motorcycleId: string;
    targetCompanyId: string;
    dealershipId?: string; // Le dealership de l'utilisateur qui fait la demande
}