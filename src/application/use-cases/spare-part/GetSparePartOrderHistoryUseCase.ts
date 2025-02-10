import { ISparePartOrderRepository } from '@application/ports/repositories/ISparePartOrderRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { UserRole } from '@domain/enums/UserRole';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';
import { SparePartMapper } from '@application/mappers/SparePartMapper';
import { SparePartOrder } from '@domain/entities/SparePartOrderEntity';
import { GetSparePartOrderHistoryDTO } from '@application/dtos/spare-part/request/GetSparePartOrderHistoryDTO';
import { OrderHistoryItemDTO } from '@application/dtos/spare-part/response/OrderHistoryItemDTO';

export class GetSparePartOrderHistoryUseCase {
  constructor(
    private readonly sparePartOrderRepository: ISparePartOrderRepository,
    private readonly dealershipRepository: IDealershipRepository,
  ) {}

  async execute(
    dto: GetSparePartOrderHistoryDTO,
  ): Promise<OrderHistoryItemDTO[]> {
    // Si c'est un admin, toutes les commandes
    if (dto.userRole === UserRole.TRIUMPH_ADMIN) {
      const orders = await this.sparePartOrderRepository.findByDateRange(
        dto.dealershipId,
        dto.startDate || new Date(0),
        dto.endDate || new Date(),
      );

      return this.mapOrdersToDTO(orders);
    }

    // Pour les managers de concession et stock managers
    if (
      ![
        UserRole.DEALERSHIP_MANAGER,
        UserRole.DEALERSHIP_STOCK_MANAGER,
      ].includes(dto.userRole)
    ) {
      throw new UnauthorizedError(
        "Vous n'avez pas les droits pour consulter l'historique des commandes",
      );
    }

    // Pour les non-admins, vérifier le dealership
    if (dto.dealershipId) {
      const dealership = await this.dealershipRepository.findById(
        dto.dealershipId,
      );
      if (!dealership) {
        throw new Error('Concession non trouvée');
      }

      if (!dealership.hasEmployee(dto.userId)) {
        throw new UnauthorizedError("Vous n'appartenez pas à cette concession");
      }
    }

    const orders = await this.sparePartOrderRepository.findByDateRange(
      dto.dealershipId,
      dto.startDate || new Date(0),
      dto.endDate || new Date(),
    );

    if (dto.status) {
      orders.filter((order) => order.orderStatus === dto.status);
    }

    return this.mapOrdersToDTO(orders);
  }

  private mapOrdersToDTO(orders: SparePartOrder[]): OrderHistoryItemDTO[] {
    return orders.map((order) => ({
      orderId: order.id,
      orderDate: order.createdAt,
      status: order.orderStatus,
      items: order.orderItems.map((item) => {
        const sparePartDTO = SparePartMapper.toDTO(item.sparePart);
        return {
          ...sparePartDTO,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        };
      }),
      totalAmount: order.getTotalCost(),
      estimatedDeliveryDate: order.getEstimatedDeliveryDate(),
      deliveredAt: order.getDeliveryDate(),
    }));
  }
}
