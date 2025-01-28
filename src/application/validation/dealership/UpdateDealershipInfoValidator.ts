import { UpdateDealershipInfoDTO } from '@application/dtos/dealership/UpdateDealershipInfoDTO';
import { DealershipValidationError } from '@domain/errors/dealership/DealershipValidationError';

export class UpdateDealershipInfoValidator {
    public validate(dto: UpdateDealershipInfoDTO): void {
        if (dto.name !== undefined && !dto.name.trim()) {
            throw new DealershipValidationError('Name cannot be empty');
        }

        // Si une partie de l'adresse est fournie, toutes les parties doivent être fournies
        const addressFields = [dto.street, dto.city, dto.postalCode, dto.country];
        const hasPartialAddress = addressFields.some(field => field !== undefined);
        const hasMissingAddress = addressFields.some(field => field === undefined || !field.trim());
        
        if (hasPartialAddress && hasMissingAddress) {
            throw new DealershipValidationError('All address fields are required when updating address');
        }

        // Valider le format du code postal
        if (dto.postalCode && !/^\d{5}$/.test(dto.postalCode)) {
            throw new DealershipValidationError('Invalid postal code format');
        }

        // Valider le format du téléphone
        if (dto.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(dto.phone)) {
            throw new DealershipValidationError('Invalid phone number format');
        }

        // Valider le format de l'email
        if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
            throw new DealershipValidationError('Invalid email format');
        }
    }
}