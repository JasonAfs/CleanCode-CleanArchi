import { DomainError } from '@domain/errors/DomainError';
import { IWarrantyProps } from '@domain/interfaces/maintenance/IWarrantyProps';
import { WarrantyType } from '@domain/enums/MaintenanceEnums';
import { randomUUID } from 'crypto';

export class WarrantyError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class Warranty {
  private readonly props: IWarrantyProps;

  private constructor(props: IWarrantyProps) {
    this.props = props;
  }

  public static create(
    type: WarrantyType,
    startDate: Date,
    endDate: Date,
    mileageLimit?: number,
    description?: string,
  ): Warranty {
    if (endDate <= startDate) {
      throw new WarrantyError('End date must be after start date');
    }

    if (mileageLimit !== undefined && mileageLimit <= 0) {
      throw new WarrantyError('Mileage limit must be greater than 0');
    }

    return new Warranty({
      id: randomUUID(),
      type,
      startDate,
      endDate,
      mileageLimit,
      description: description?.trim(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get type(): WarrantyType {
    return this.props.type;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get mileageLimit(): number | undefined {
    return this.props.mileageLimit;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  // Méthodes
  public isValid(currentDate: Date, currentMileage?: number): boolean {
    if (!this.props.isActive) return false;

    if (currentDate > this.props.endDate) return false;

    if (this.props.mileageLimit && currentMileage) {
      return currentMileage <= this.props.mileageLimit;
    }

    return true;
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
