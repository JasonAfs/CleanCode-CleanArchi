import { SparePart } from '@domain/value-objects/SparePart';
import { SparePartResponseDTO } from '../dtos/spare-part/response/SparePartResponseDTO';

export class SparePartMapper {
  public static toDTO(sparePart: SparePart): SparePartResponseDTO {
    return {
      reference: sparePart.sparePartReference,
      name: sparePart.sparePartName,
      category: sparePart.sparePartCategory,
      description: sparePart.sparePartDescription,
      manufacturer: sparePart.sparePartManufacturer,
      compatibleModels: sparePart.sparePartCompatibleModels,
      minimumThreshold: sparePart.sparePartMinimumThreshold,
      unitPrice: sparePart.sparePartUnitPrice,
      isActive: sparePart.isActive,
      createdAt: sparePart.createdAt,
      updatedAt: sparePart.updatedAt,
    };
  }
}
