import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { SparePartResponseDTO } from '@application/dtos/spare-part/response/SparePartResponseDTO';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { SparePartMapper } from '@application/mappers/SparePartMapper';
import { SparePartNotFoundError } from '@domain/errors/spare-part/SparePartNotFoundError';
import { GetSparePartDetailsDTO } from '@application/dtos/spare-part/request/GetSparePartDetailsDTO';

export class GetSparePartDetailsUseCase {
  constructor(private readonly sparePartRepository: ISparePartRepository) {}

  async execute(
    dto: GetSparePartDetailsDTO,
  ): Promise<Error | SparePartResponseDTO> {
    try {
      // Vérification du rôle
      if (
        ![UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER].includes(
          dto.userRole,
        )
      ) {
        throw new UnauthorizedError(
          'Only TRIUMPH_ADMIN and DEALERSHIP_MANAGER can view spare part details',
        );
      }

      // Récupération de la pièce
      const sparePart = await this.sparePartRepository.findByReference(
        dto.reference,
      );
      if (!sparePart) {
        return new SparePartNotFoundError(dto.reference);
      }

      return SparePartMapper.toDTO(sparePart);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while retrieving spare part details',
      );
    }
  }
}
