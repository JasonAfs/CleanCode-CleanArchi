import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { DeleteSparePartDTO } from '@application/dtos/spare-part/request/DeleteSparePartDTO';

export class DeleteSparePartUseCase {
  constructor(private readonly sparePartRepository: ISparePartRepository) {}

  async execute(dto: DeleteSparePartDTO): Promise<void> {
    if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
      throw new UnauthorizedError('Only TRIUMPH_ADMIN can delete spare parts');
    }

    const sparePart = await this.sparePartRepository.findByReference(
      dto.reference,
    );

    if (!sparePart) {
      throw new Error(`Spare part with reference ${dto.reference} not found`);
    }

    await this.sparePartRepository.delete(dto.reference);
  }
}
