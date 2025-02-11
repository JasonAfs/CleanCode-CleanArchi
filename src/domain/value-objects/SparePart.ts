import { DomainError } from '@domain/errors/DomainError';
import { ISparePartProps } from '@domain/interfaces/maintenance/ISparePartProps';
import { Model } from '@domain/value-objects/Model';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export class SparePart {
  private readonly props: SparePartProps;

  private constructor(props: SparePartProps) {
    this.props = props;
  }

  public static create(
    props: Omit<SparePartProps, 'isActive' | 'createdAt' | 'updatedAt'>,
  ): SparePart {
    return new SparePart({
      ...props,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get sparePartReference(): string {
    return this.props.reference;
  }

  get sparePartName(): string {
    return this.props.name;
  }

  get sparePartCategory(): SparePartCategory {
    return this.props.category;
  }

  get quantity(): number {
    // This property is not provided in the constructor or the create method
    throw new Error(
      'Quantity is not provided in the constructor or create method',
    );
  }

  get unitPrice(): number {
    // This property is not provided in the constructor or the create method
    throw new Error(
      'Unit price is not provided in the constructor or create method',
    );
  }

  get currency(): string {
    // This property is not provided in the constructor or the create method
    throw new Error(
      'Currency is not provided in the constructor or create method',
    );
  }

  get totalPrice(): number {
    // This property is not provided in the constructor or the create method
    throw new Error(
      'Total price is not provided in the constructor or create method',
    );
  }

  get sparePartDescription(): string {
    return this.props.description;
  }

  get sparePartManufacturer(): string {
    return this.props.manufacturer;
  }

  get sparePartCompatibleModels(): MotorcycleModel[] {
    return this.props.compatibleModels;
  }

  get sparePartMinimumThreshold(): number {
    return this.props.minimumStockThreshold;
  }

  get sparePartUnitPrice(): number {
    return this.props.unitPrice;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public getPrice(): number {
    // This property is not provided in the constructor or the create method
    throw new Error(
      'Price is not provided in the constructor or create method',
    );
  }
}

export enum SparePartCategory {
  FILTER = 'FILTER',
  TIRE = 'TIRE',
  BRAKE = 'BRAKE',
  ENGINE = 'ENGINE',
  TRANSMISSION = 'TRANSMISSION',
  ELECTRICAL = 'ELECTRICAL',
  OTHER = 'OTHER',
}

export class SparePartError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export interface SparePartProps {
  reference: string;
  name: string;
  category: SparePartCategory;
  description: string;
  manufacturer: string;
  compatibleModels: MotorcycleModel[];
  minimumStockThreshold: number;
  unitPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
