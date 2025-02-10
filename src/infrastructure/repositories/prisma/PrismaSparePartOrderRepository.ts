import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/nestjs/prisma/prisma.service';
import { ISparePartOrderRepository } from '@application/ports/repositories/ISparePartOrderRepository';
import {
  SparePartOrder,
  OrderStatus,
} from '@domain/entities/SparePartOrderEntity';
import { SparePart } from '@domain/value-objects/SparePart';
import { SparePartOrderMapper } from '@infrastructure/repositories/mappers/SparePartOrderMapper';

@Injectable()
export class PrismaSparePartOrderRepository
  implements ISparePartOrderRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(order: SparePartOrder): Promise<void> {
    // Récupérer ou créer le dealershipStock pour chaque item de la commande
    for (const item of order.orderItems) {
      const sparePart = item.sparePart;

      // Chercher le dealershipStock existant
      let dealershipStock = await this.prisma.dealershipStock.findFirst({
        where: {
          dealershipId: order.getDealershipId(),
          sparePart: {
            reference: sparePart.sparePartReference,
          },
        },
      });

      // Si le dealershipStock n'existe pas, le créer
      if (!dealershipStock) {
        dealershipStock = await this.prisma.dealershipStock.create({
          data: {
            dealershipId: order.getDealershipId(),
            sparePartId: (await this.prisma.sparePart.findUnique({
              where: { reference: sparePart.sparePartReference },
            }))!.id,
            quantity: 0, // Stock initial à 0
            threshold: sparePart.sparePartMinimumThreshold || 0, // Seuil minimal par défaut
          },
        });
      }

      // Créer la commande
      await this.prisma.sparePartOrder.create({
        data: {
          ...SparePartOrderMapper.toPrismaCreate(order),
          dealershipStockId: dealershipStock.id,
        },
      });
    }
  }

  async findByDealershipId(dealershipId: string): Promise<SparePartOrder[]> {
    const orders = await this.prisma.sparePartOrder.findMany({
      where: {
        dealershipStock: {
          dealership: { id: dealershipId },
        },
      },
      include: {
        dealershipStock: {
          include: {
            sparePart: true,
          },
        },
      },
    });

    return orders.map(this.mapToDomain);
  }

  async findByDateRange(
    dealershipId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SparePartOrder[]> {
    const orders = await this.prisma.sparePartOrder.findMany({
      where: {
        dealershipStock: {
          dealership: { id: dealershipId },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        dealershipStock: {
          include: {
            sparePart: true,
            dealership: true,
          },
        },
      },
    });

    return orders.map(this.mapToDomain);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.prisma.sparePartOrder.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async update(order: SparePartOrder): Promise<void> {
    await this.prisma.sparePartOrder.update({
      where: { id: order.id },
      data: SparePartOrderMapper.toPrismaUpdate(order),
    });
  }

  async findById(id: string): Promise<SparePartOrder | null> {
    const order = await this.prisma.sparePartOrder.findUnique({
      where: { id },
      include: { dealershipStock: { include: { sparePart: true } } },
    });
    return order ? this.mapToDomain(order) : null;
  }

  async findByStatus(status: OrderStatus): Promise<SparePartOrder[]> {
    const orders = await this.prisma.sparePartOrder.findMany({
      where: { status },
      include: { dealershipStock: { include: { sparePart: true } } },
    });
    return orders.map(this.mapToDomain);
  }

  async findPendingOrders(): Promise<SparePartOrder[]> {
    return this.findByStatus(OrderStatus.PENDING);
  }

  async getOrderStats(dealershipId: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    totalAmount: number;
    averageDeliveryTime: number;
  }> {
    const orders = await this.prisma.sparePartOrder.findMany({
      where: {
        dealershipStock: {
          dealership: { id: dealershipId },
        },
      },
      include: {
        dealershipStock: true,
      },
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.status === OrderStatus.PENDING,
    ).length;
    const totalAmount = orders.reduce((sum, o) => sum + o.unitPrice, 0);

    const deliveredOrders = orders.filter((o) => o.deliveredAt);
    const averageDeliveryTime = deliveredOrders.length
      ? deliveredOrders.reduce(
          (sum, o) => sum + (o.deliveredAt!.getTime() - o.createdAt.getTime()),
          0,
        ) /
        deliveredOrders.length /
        (1000 * 60 * 60 * 24)
      : 0;

    return {
      totalOrders,
      pendingOrders,
      totalAmount,
      averageDeliveryTime,
    };
  }

  private mapToDomain(order: any): SparePartOrder {
    return SparePartOrderMapper.toDomain(order);
  }
}
