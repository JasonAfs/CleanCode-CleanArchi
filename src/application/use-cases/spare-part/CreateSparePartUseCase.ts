import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { CreateSparePartDTO } from '@application/dtos/spare-part/request/CreateSparePartDTO';
import { SparePartResponseDTO } from '@application/dtos/spare-part/response/SparePartResponseDTO';
import { SparePart } from '@domain/value-objects/SparePart';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { SparePartMapper } from '@application/mappers/SparePartMapper';

export class CreateSparePartUseCase {
  constructor(private readonly sparePartRepository: ISparePartRepository) {}

  public async execute(
    dto: CreateSparePartDTO,
  ): Promise<SparePartResponseDTO | Error> {
    try {
      if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
        throw new UnauthorizedError(
          'Only TRIUMPH_ADMIN can create spare parts',
        );
      }


      const exists = await this.sparePartRepository.exists(dto.reference);
      if (exists) {
        throw new Error(
          `Spare part with reference ${dto.reference} already exists`,
        );
      }


      const sparePart = SparePart.create({
        reference: dto.reference,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        manufacturer: dto.manufacturer,
        compatibleModels: dto.compatibleModels,
        minimumStockThreshold: dto.minimumThreshold,
        unitPrice: dto.unitPrice,
      });


      await this.sparePartRepository.create(sparePart);

      return SparePartMapper.toDTO(sparePart);
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
      return new Error(
        'An unexpected error occurred while creating the spare part',
      );
    }
  }
}
