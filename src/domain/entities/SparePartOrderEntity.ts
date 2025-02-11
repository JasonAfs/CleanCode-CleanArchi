import { DomainError } from '@domain/errors/DomainError';
import { SparePart } from '@domain/value-objects/SparePart';
import { randomUUID } from 'crypto';

export class SparePartOrder {
  private constructor(
    private readonly _id: string,
    private readonly dealershipId: string,
    private readonly items: OrderItem[],
    private status: OrderStatus,
    private readonly orderedAt: Date,
    private estimatedDeliveryDate: Date | null,
    private deliveredAt: Date | null,
  ) {}

  public static create(
    dealershipId: string,
    items: OrderItem[],
    estimatedDeliveryDate?: Date,
  ): SparePartOrder {
    if (items.length === 0) {
      throw new SparePartOrderError('Order must contain at least one item');
    }

    return new SparePartOrder(
      randomUUID(),
      dealershipId,
      items,
      OrderStatus.PENDING,
      new Date(),
      estimatedDeliveryDate || null,
      null,
    );
  }

  public confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new SparePartOrderError('Can only confirm pending orders');
    }
    this.status = OrderStatus.CONFIRMED;
  }

  public ship(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new SparePartOrderError('Can only ship confirmed orders');
    }
    this.status = OrderStatus.SHIPPED;
  }

  public deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new SparePartOrderError('Can only deliver shipped orders');
    }
    this.status = OrderStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  public cancel(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new SparePartOrderError('Can only cancel pending orders');
    }
    this.status = OrderStatus.CANCELLED;
  }

  public updateEstimatedDeliveryDate(date: Date): void {
    this.estimatedDeliveryDate = date;
  }

  public getTotalCost(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
  }

  public static reconstitute(props: ReconstituteProps): SparePartOrder {
    return new SparePartOrder(
      props.id,
      props.dealershipId,
      props.items,
      props.status,
      props.orderedAt,
      props.estimatedDeliveryDate || null,
      props.deliveredAt || null,
    );
  }

  // Getters
  get orderStatus(): OrderStatus {
    return this.status;
  }

  get orderItems(): OrderItem[] {
    return [...this.items];
  }

  public get id(): string {
    return this._id;
  }

  public get createdAt(): Date {
    return this.orderedAt;
  }

  public getEstimatedDeliveryDate(): Date | undefined {
    return this.estimatedDeliveryDate || undefined;
  }

  public getDeliveryDate(): Date | undefined {
    return this.deliveredAt || undefined;
  }

  public getDealershipId(): string {
    return this.dealershipId;
  }

  public getTotalQuantity(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class SparePartOrderError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

interface OrderItem {
  sparePart: SparePart;
  quantity: number;
  unitPrice: number;
}

interface ReconstituteProps {
  id: string;
  dealershipId: string;
  items: OrderItem[];
  status: OrderStatus;
  orderedAt: Date;
  estimatedDeliveryDate?: Date;
  deliveredAt?: Date;
}
