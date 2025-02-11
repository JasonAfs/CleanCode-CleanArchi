import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleResponseDTO } from '../dtos/motorcycle/response/MotorcycleResponseDTO';
import { MotorcycleNotFoundError } from '@domain/errors/motorcycle/MotorcycleValidationError';

export class MotorcycleMapper {
  public static toDTO(motorcycle: Motorcycle): MotorcycleResponseDTO {
    if (!motorcycle.holder) {
      throw new MotorcycleNotFoundError(
        `Invalid motorcycle state: no holder found for motorcycle ${motorcycle.id}`,
      );
    }
    return {
      id: motorcycle.id,
      vin: motorcycle.vin.toString(),
      model: {
        type: motorcycle.model.modelType,
        year: motorcycle.model.year,
        displacement: motorcycle.model.displacement,
        category: motorcycle.model.category,
        maintenanceInterval: motorcycle.model.maintenanceInterval,
      },
      color: motorcycle.color,
      mileage: motorcycle.mileage,
      status: motorcycle.status,
      holder: {
        dealershipId: motorcycle.holder.dealershipId,
        companyId: motorcycle.holder.companyId,
        assignedAt: motorcycle.holder.assignedAt,
      },
      isActive: motorcycle.isActive,
      createdAt: motorcycle.createdAt,
      updatedAt: motorcycle.updatedAt,
    };
  }
}
