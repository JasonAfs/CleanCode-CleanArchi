import { ISparePartOrderRepository } from '@application/ports/repositories/ISparePartOrderRepository';
import { ISparePartStockRepository } from '@application/ports/repositories/ISparePartStockRepository';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';
import { UnauthorizedError } from '@domain/errors/authorization/UnauthorizedError';
import { UserRole } from '@domain/enums/UserRole';
import { BaseAuthenticatedDTO } from '@application/dtos/shared/BaseAuthenticatedDTO';

export class ValidateSparePartOrderUseCase {
  constructor(
    private readonly sparePartOrderRepository: ISparePartOrderRepository,
    private readonly sparePartStockRepository: ISparePartStockRepository,
  ) {}

  async execute(
    dto: ValidateSparePartOrderDTO,
  ): Promise<ValidateSparePartOrderResponseDTO> {
    // Vérification du rôle
    console.log('laaaaaaa' + dto.userRole);
    if (dto.userRole !== UserRole.TRIUMPH_ADMIN) {
      throw new UnauthorizedError(
        'Only TRIUMPH_ADMIN can validate spare part orders',
      );
    }

    // Récupération de la commande
    const order = await this.sparePartOrderRepository.findById(dto.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Vérification que la commande est en attente
    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new Error('Can only validate pending orders');
    }

    if (dto.action === 'CONFIRM') {
      // Confirmation de la commande
      order.confirm();
      await this.sparePartOrderRepository.update(order);

      // Mise à jour du stock du concessionnaire
      const dealershipId = order.getDealershipId();
      const stock =
        await this.sparePartStockRepository.findByDealershipId(dealershipId);

      const updatedStock = [];

      // Ajout des pièces commandées au stock
      for (const item of order.orderItems) {
        stock.addStock(item.sparePart, item.quantity);
        updatedStock.push({
          sparePartReference: item.sparePart.sparePartReference,
          newQuantity: stock.getStock(item.sparePart.sparePartReference),
        });
      }

      await this.sparePartStockRepository.updateStock(dealershipId, stock);

      return {
        success: true,
        message: 'Order confirmed and stock updated',
        orderId: order.id,
        newStatus: OrderStatus.CONFIRMED,
        updatedStock,
      };
    } else {
      // Annulation de la commande
      order.cancel();
      await this.sparePartOrderRepository.update(order);

      return {
        success: true,
        message: 'Order cancelled',
        orderId: order.id,
        newStatus: OrderStatus.CANCELLED,
      };
    }
  }
}

export interface ValidateSparePartOrderDTO extends BaseAuthenticatedDTO {
  orderId: string;
  action: 'CONFIRM' | 'CANCEL';
}

export interface ValidateSparePartOrderResponseDTO {
  success: boolean;
  message: string;
  orderId: string;
  newStatus: OrderStatus;
  updatedStock?: {
    sparePartReference: string;
    newQuantity: number;
  }[];
}
