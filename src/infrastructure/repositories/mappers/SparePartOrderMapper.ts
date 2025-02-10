import {
  SparePartOrder as PrismaSparePartOrder,
  DealershipStock,
} from '@prisma/client';
import { SparePartOrder } from '@domain/entities/SparePartOrderEntity';
import { SparePart } from '@domain/value-objects/SparePart';
import { OrderStatus } from '@domain/entities/SparePartOrderEntity';

export class SparePartOrderMapper {
  /**
   * Convertit une entité Prisma en entité de domaine
   */
  public static toDomain(
    prismaOrder: PrismaSparePartOrder & {
      dealershipStock: DealershipStock & {
        sparePart: any;
      };
    },
  ): SparePartOrder {
    return SparePartOrder.reconstitute({
      id: prismaOrder.id,
      dealershipId: prismaOrder.dealershipStock.dealershipId,
      items: [
        {
          sparePart: SparePart.create({
            reference: prismaOrder.dealershipStock.sparePart.reference,
            name: prismaOrder.dealershipStock.sparePart.name,
            category: prismaOrder.dealershipStock.sparePart.category,
            description: prismaOrder.dealershipStock.sparePart.description,
            manufacturer: prismaOrder.dealershipStock.sparePart.manufacturer,
            compatibleModels:
              prismaOrder.dealershipStock.sparePart.compatibleModels,
            minimumStockThreshold:
              prismaOrder.dealershipStock.sparePart.minimumThreshold,
            unitPrice: prismaOrder.unitPrice,
          }),
          quantity: prismaOrder.quantity,
          unitPrice: prismaOrder.unitPrice,
        },
      ],
      status: prismaOrder.status as OrderStatus,
      orderedAt: prismaOrder.createdAt,
      estimatedDeliveryDate: prismaOrder.estimatedDeliveryDate || undefined,
      deliveredAt: prismaOrder.deliveredAt || undefined,
    });
  }

  /**
   * Convertit une entité de domaine en objet Prisma pour la création
   */
  public static toPrismaCreate(order: SparePartOrder): any {
    const orderItem = order.orderItems[0];
    return {
      status: order.orderStatus,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      estimatedDeliveryDate: order.getEstimatedDeliveryDate() || null,
      deliveredAt: order.getDeliveryDate() || null,
    };
  }

  /**
   * Convertit une entité de domaine en objet Prisma pour la mise à jour
   */
  public static toPrismaUpdate(order: SparePartOrder): any {
    return {
      status: order.orderStatus,
      estimatedDeliveryDate: order.getEstimatedDeliveryDate() || null,
      deliveredAt: order.getDeliveryDate() || null,
    };
  }
}
