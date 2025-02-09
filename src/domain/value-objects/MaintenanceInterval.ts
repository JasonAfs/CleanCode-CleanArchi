import { DomainError } from '@domain/errors/DomainError';

export class MaintenanceIntervalError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MaintenanceInterval {
  private constructor(
    private readonly kilometers: number,
    private readonly monthsInterval: number,
  ) {}

  public static create(
    kilometers: number,
    monthsInterval: number,
  ): MaintenanceInterval {
    if (kilometers < 0) {
      throw new MaintenanceIntervalError(
        'Kilometers interval cannot be negative',
      );
    }
    if (monthsInterval < 0) {
      throw new MaintenanceIntervalError('Months interval cannot be negative');
    }

    return new MaintenanceInterval(kilometers, monthsInterval);
  }

  get distanceInterval(): number {
    return this.kilometers;
  }

  get timeInterval(): number {
    return this.monthsInterval;
  }
}
