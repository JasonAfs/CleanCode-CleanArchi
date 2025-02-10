import { DomainError } from '@domain/errors/DomainError';

export class MaintenanceCostError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MaintenanceCost {
  private constructor(
    private readonly laborCost: number,
    private readonly taxAmount: number,
    private readonly partsCost: number,
    private readonly currency: string = 'EUR',
  ) {
    if (laborCost < 0) {
      throw new MaintenanceCostError('Labor cost cannot be negative');
    }
    if (partsCost < 0) {
      throw new MaintenanceCostError('Parts cost cannot be negative');
    }
    if (taxAmount < 0) {
      throw new MaintenanceCostError('Tax amount cannot be negative');
    }
  }

  public static create(props: {
    laborCost: number;
    taxAmount: number;
    partsCost: number;
    currency?: string;
  }): MaintenanceCost {
    return new MaintenanceCost(
      props.laborCost,
      props.taxAmount,
      props.partsCost,
      props.currency,
    );
  }

  get totalCost(): number {
    return this.laborCost + this.taxAmount + this.partsCost;
  }

  // Getters
  get maintenanceLaborCost(): number {
    return this.laborCost;
  }

  get maintenanceTaxAmount(): number {
    return this.taxAmount;
  }

  get maintenancePartsCost(): number {
    return this.partsCost;
  }

  get maintenanceCurrency(): string {
    return this.currency;
  }

  // Calculs
  get subtotal(): number {
    return this.laborCost + this.partsCost;
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }
}
