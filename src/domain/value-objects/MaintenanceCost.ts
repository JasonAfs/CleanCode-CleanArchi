import { DomainError } from '@domain/errors/DomainError';
import { IMaintenanceCostProps } from '@domain/interfaces/maintenance/IMaintenanceCostProps';

export class MaintenanceCostError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MaintenanceCost {
  private readonly props: IMaintenanceCostProps;

  private constructor(props: IMaintenanceCostProps) {
    this.props = props;
  }

  public static create(props: IMaintenanceCostProps): MaintenanceCost {
    if (props.laborCost < 0) {
      throw new MaintenanceCostError('Labor cost cannot be negative');
    }

    if (props.partsCost < 0) {
      throw new MaintenanceCostError('Parts cost cannot be negative');
    }

    if (props.taxRate && (props.taxRate < 0 || props.taxRate > 100)) {
      throw new MaintenanceCostError('Tax rate must be between 0 and 100');
    }

    return new MaintenanceCost(props);
  }

  // Getters
  get laborCost(): number {
    return this.props.laborCost;
  }

  get partsCost(): number {
    return this.props.partsCost;
  }

  get currency(): string {
    return this.props.currency;
  }

  get taxRate(): number {
    return this.props.taxRate ?? 0;
  }

  // Calculs
  get subtotal(): number {
    return this.laborCost + this.partsCost;
  }

  get taxAmount(): number {
    return this.subtotal * (this.taxRate / 100);
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }
}
