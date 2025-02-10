import { ISparePartOrderRepository } from '@application/ports/repositories/ISparePartOrderRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { SparePartOrder } from '@domain/entities/SparePartOrderEntity';
import { SparePart } from '@domain/value-objects/SparePart';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserRole } from '@domain/enums/UserRole';

interface OrderSparePartsDTO {
  dealershipId: string;
  userId: string;
  userRole: UserRole;
  items: Array<{
    sparePartReference: string;
    quantity: number;
  }>;
  estimatedDeliveryDate?: Date;
}

export class OrderSparePartsUseCase {
  constructor(
    private readonly sparePartOrderRepository: ISparePartOrderRepository,
    private readonly dealershipRepository: IDealershipRepository,
    private readonly sparePartRepository: ISparePartRepository,
  ) {}

  async execute(dto: OrderSparePartsDTO): Promise<{ orderId: string }> {
    console.log('UseCase - Raw DTO:', dto);
    console.log('UseCase - Items:', dto.items);
    console.log('UseCase - First item:', dto.items[0]);

    if (
      ![
        UserRole.DEALERSHIP_MANAGER,
        UserRole.DEALERSHIP_STOCK_MANAGER,
      ].includes(dto.userRole)
    ) {
      throw new UnauthorizedError(
        "Vous n'avez pas les droits pour commander des pièces détachées",
      );
    }

    const dealership = await this.dealershipRepository.findById(
      dto.dealershipId,
    );
    if (!dealership) {
      throw new Error('Concession non trouvée');
    }

    // Vérifier que l'utilisateur appartient bien à cette concession
    if (!dealership.hasEmployee(dto.userId)) {
      throw new UnauthorizedError("Vous n'appartenez pas à cette concession");
    }

    // Vérifier et récupérer toutes les pièces
    const spareParts: Array<{ part: SparePart; quantity: number }> = [];
    for (const item of dto.items) {
      if (!item.sparePartReference) {
        throw new Error('La référence de la pièce est requise');
      }

      console.log('UseCase - Processing item:', {
        reference: item.sparePartReference,
        quantity: item.quantity,
      });

      const part = await this.sparePartRepository.findByReference(
        item.sparePartReference,
      );

      if (!part) {
        throw new Error(
          `Pièce détachée ${item.sparePartReference} non trouvée`,
        );
      }

      // Vérifier que le prix existe
      if (!part.sparePartUnitPrice) {
        throw new Error(
          `Prix non défini pour la pièce ${item.sparePartReference}`,
        );
      }

      spareParts.push({ part, quantity: item.quantity });
    }

    // Créer la commande
    const order = SparePartOrder.create(
      dto.dealershipId,
      spareParts.map(({ part, quantity }) => ({
        sparePart: part,
        quantity,
        unitPrice: part.sparePartUnitPrice,
      })),
      dto.estimatedDeliveryDate,
    );

    await this.sparePartOrderRepository.create(order);

    return { orderId: order.id };
  }
}
