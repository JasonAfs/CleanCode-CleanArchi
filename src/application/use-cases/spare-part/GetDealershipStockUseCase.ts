import { ISparePartStockRepository } from '@application/ports/repositories/ISparePartStockRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { SparePartMapper } from '@application/mappers/SparePartMapper';
import {
  GetDealershipStockRequestDTO,
  GetDealershipStockResponseDTO,
} from '@application/dtos/spare-part/request/GetDealershipStockDTO';

export class GetDealershipStockUseCase {
  constructor(
    private readonly sparePartStockRepository: ISparePartStockRepository,
    private readonly dealershipRepository: IDealershipRepository,
    private readonly sparePartRepository: ISparePartRepository,
  ) {}

  async execute(
    dto: GetDealershipStockRequestDTO,
  ): Promise<GetDealershipStockResponseDTO[]> {
    const authorizedRoles = [
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_STOCK_MANAGER,
      UserRole.DEALERSHIP_TECHNICIAN,
    ];

    if (!authorizedRoles.includes(dto.userRole)) {
      throw new UnauthorizedError(
        "Vous n'avez pas les droits pour consulter le stock",
      );
    }

    const dealership = await this.dealershipRepository.findById(
      dto.dealershipId,
    );
    if (!dealership) {
      throw new Error('Concession non trouvée');
    }

    if (!dealership.hasEmployee(dto.userId)) {
      throw new UnauthorizedError("Vous n'appartenez pas à cette concession");
    }

    const stock = await this.sparePartStockRepository.findByDealershipId(
      dto.dealershipId,
    );
    const stockEntries = stock.getStockEntries();

    const result = await Promise.all(
      stockEntries.map(async ([reference, quantity]) => {
        const part = await this.sparePartRepository.findByReference(reference);
        if (!part) throw new Error(`Pièce détachée ${reference} non trouvée`);

        const sparePartDTO = SparePartMapper.toDTO(part);
        return {
          ...sparePartDTO,
          currentQuantity: quantity,
          minimumThreshold: stock.getMinimumThreshold(reference),
          isLowStock: stock.isStockLow(reference),
        };
      }),
    );

    return result;
  }
}
