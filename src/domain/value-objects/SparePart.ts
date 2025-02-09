import { DomainError } from '@domain/errors/DomainError';
import { ISparePartProps } from '@domain/interfaces/maintenance/ISparePartProps';

export class SparePartError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class SparePart {
  private readonly props: ISparePartProps;

  private constructor(props: ISparePartProps) {
    this.props = props;
  }

  public static create(props: ISparePartProps): SparePart {
    // Validations
    if (!props.reference || props.reference.trim().length === 0) {
      throw new SparePartError('Reference is required');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new SparePartError('Name is required');
    }

    if (props.quantity <= 0) {
      throw new SparePartError('Quantity must be greater than 0');
    }

    if (props.unitPrice < 0) {
      throw new SparePartError('Unit price cannot be negative');
    }

    return new SparePart({
      ...props,
      reference: props.reference.trim(),
      name: props.name.trim(),
    });
  }

  // Getters
  get reference(): string {
    return this.props.reference;
  }

  get name(): string {
    return this.props.name;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get currency(): string {
    return this.props.currency;
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }
}
