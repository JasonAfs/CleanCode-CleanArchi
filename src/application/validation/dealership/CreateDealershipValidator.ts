import { CreateDealershipDTO } from "@application/dtos/dealership/CreateDealershipDTO";
import { DealershipValidationError } from "@domain/errors/dealership/DealershipValidationError";

export class CreateDealershipValidator {
    public validate(dto: CreateDealershipDTO): void {
        // Validation de la présence des champs requis
        if (!dto.name?.trim()) {
            throw new DealershipValidationError("Name is required");
        }

        // Pour l'adresse, on vérifie juste que les champs sont présents
        // La validation du format sera faite par le value object Address
        if (!dto.street || !dto.city || !dto.postalCode || !dto.country) {
            throw new DealershipValidationError("All address fields are required");
        }

        // Pour le contact, vérification de la présence
        if (!dto.phone?.trim()) {
            throw new DealershipValidationError("Phone is required");
        }
        if (!dto.email?.trim()) {
            throw new DealershipValidationError("Email is required");
        }

        // Validation du format du téléphone uniquement
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(dto.phone)) {
            throw new DealershipValidationError("Invalid phone number format");
        }
    }
}
