import { randomUUID } from 'crypto';

export class StockNotification {
  private constructor(
    private readonly id: string,
    private readonly dealershipId: string,
    private readonly sparePartReference: string,
    private readonly type: StockNotificationType,
    private readonly currentStock: number,
    private readonly threshold: number,
    private readonly createdAt: Date,
    private isRead: boolean,
  ) {}

  public static create(
    dealershipId: string,
    sparePartReference: string,
    type: StockNotificationType,
    currentStock: number,
    threshold: number,
  ): StockNotification {
    return new StockNotification(
      randomUUID(),
      dealershipId,
      sparePartReference,
      type,
      currentStock,
      threshold,
      new Date(),
      false,
    );
  }

  public markAsRead(): void {
    this.isRead = true;
  }

  // Getters
  get notificationId(): string {
    return this.id;
  }

  get notificationType(): StockNotificationType {
    return this.type;
  }
}


export enum StockNotificationType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  REORDER_SUGGESTED = 'REORDER_SUGGESTED',
}
