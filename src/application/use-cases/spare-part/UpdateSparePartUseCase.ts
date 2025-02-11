import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { UpdateSparePartDTO } from '@application/dtos/spare-part/request/UpdateSparePartDTO';
import { SparePartResponseDTO } from '@application/dtos/spare-part/response/SparePartResponseDTO';
import { SparePart } from '@domain/value-objects/SparePart';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { SparePartMapper } from '@application/mappers/SparePartMapper';
import { SparePartNotFoundError } from '@domain/errors/spare-part/SparePartNotFoundError';

export class UpdateSparePartUseCase {
  constructor(private readonly sparePartRepository: ISparePartRepository) {}

  public async execute(
    dto: UpdateSparePartDTO,
  ): Promise<Error | SparePartResponseDTO> {
    try {
      // Vérification du rôle
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
        throw new UnauthorizedError(
          'Only TRIUMPH_ADMIN can update spare parts',
        );
      }

      // Récupération de la pièce existante
      const existingSparePart = await this.sparePartRepository.findByReference(
        dto.reference,
      );

      if (!existingSparePart) {
        return new SparePartNotFoundError(dto.reference);
      }

      // Création de la nouvelle version avec les champs mis à jour
      const updatedSparePart = SparePart.create({
        reference: existingSparePart.sparePartReference,
        name: dto.name || existingSparePart.sparePartName,
        category: dto.category || existingSparePart.sparePartCategory,
        description: dto.description || existingSparePart.sparePartDescription,
        manufacturer:
          dto.manufacturer || existingSparePart.sparePartManufacturer,
        compatibleModels:
          dto.compatibleModels || existingSparePart.sparePartCompatibleModels,
        minimumStockThreshold:
          dto.minimumThreshold || existingSparePart.sparePartMinimumThreshold,
        unitPrice: dto.unitPrice || existingSparePart.sparePartUnitPrice,
      });

      // Sauvegarde des modifications
      await this.sparePartRepository.update(updatedSparePart);

      return SparePartMapper.toDTO(updatedSparePart);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while updating the spare part',
      );
    }
  }
}
