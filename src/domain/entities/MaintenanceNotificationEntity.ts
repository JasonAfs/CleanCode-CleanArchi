import { DomainError } from '@domain/errors/DomainError';
import { randomUUID } from 'crypto';
import { MaintenanceNotificationProps } from '@domain/interfaces/Notification/MaintenanceNotificationProps';

export class MaintenanceNotificationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MaintenanceNotification {
  private readonly props: MaintenanceNotificationProps;

  private constructor(props: MaintenanceNotificationProps) {
    this.props = props;
  }

  public static create(
    motorcycleId: string,
    dealershipId: string,
    message: string,
    companyId?: string,
  ): MaintenanceNotification {
    return new MaintenanceNotification({
      id: randomUUID(),
      motorcycleId,
      dealershipId,
      companyId,
      message,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get motorcycleId(): string {
    return this.props.motorcycleId;
  }

  get dealershipId(): string {
    return this.props.dealershipId;
  }

  get companyId(): string | undefined {
    return this.props.companyId;
  }

  get message(): string {
    return this.props.message;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Methods
  public markAsRead(): void {
    this.props.isRead = true;
    this.props.updatedAt = new Date();
  }
}
