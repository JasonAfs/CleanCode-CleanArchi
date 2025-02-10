import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { SparePartResponseDTO } from '@application/dtos/spare-part/response/SparePartResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { SparePartCategory } from '@domain/value-objects/SparePart';
import { SparePartMapper } from '@application/mappers/SparePartMapper';
import { GetSparePartsDTO } from '@application/dtos/spare-part/request/GetSparePartsDTO';

export class GetSparePartsUseCase {
  constructor(private readonly sparePartRepository: ISparePartRepository) {}

  async execute(
    dto: GetSparePartsDTO,
  ): Promise<SparePartResponseDTO[] | Error> {
    try {
      // Vérification du rôle
      if (
        ![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(
          dto.userRole,
        )
      ) {
        throw new UnauthorizedError(
          'Only TRIUMPH_ADMIN and DEALERSHIP_MANAGER can view spare parts',
        );
      }

      // Récupération des pièces selon les filtres
      const spareParts = await this.sparePartRepository.findAll({
        category: dto.category,
        manufacturer: dto.manufacturer,
        compatibleModel: dto.compatibleModel,
      });

      return spareParts.map((sparePart) => SparePartMapper.toDTO(sparePart));
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving spare parts',
      );
    }
  }
}
