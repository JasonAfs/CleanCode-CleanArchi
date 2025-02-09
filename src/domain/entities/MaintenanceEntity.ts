import {
  IMaintenanceProps,
  CreateMaintenanceProps,
  ReconstituteMaintenanceProps,
} from '@domain/interfaces/maintenance/IMaintenanceProps';
import {
  MaintenanceStatus,
  MaintenanceType,
  RecommendationPriority,
} from '@domain/enums/MaintenanceEnums';
import { DomainError } from '@domain/errors/DomainError';
import { randomUUID } from 'crypto';
import { SparePart } from '@domain/value-objects/SparePart';
import { MaintenanceCost } from '@domain/value-objects/MaintenanceCost';
import { TechnicianRecommendation } from '@domain/value-objects/TechnicianRecommendation';
import { Warranty } from '@domain/value-objects/Warranty';

export class MaintenanceValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class Maintenance {
  private readonly props: IMaintenanceProps;

  private constructor(props: IMaintenanceProps) {
    this.props = props;
  }

  public static create(props: CreateMaintenanceProps): Maintenance {
    if (!props.motorcycleId) {
      throw new MaintenanceValidationError('Motorcycle ID is required');
    }

    if (!props.dealershipId) {
      throw new MaintenanceValidationError('Dealership ID is required');
    }

    if (!props.description.trim()) {
      throw new MaintenanceValidationError('Description is required');
    }

    if (props.mileage < 0) {
      throw new MaintenanceValidationError('Mileage cannot be negative');
    }

    if (props.scheduledDate < new Date()) {
      throw new MaintenanceValidationError(
        'Scheduled date cannot be in the past',
      );
    }

    return new Maintenance({
      ...props,
      id: randomUUID(),
      status: MaintenanceStatus.PLANNED,
      spareParts: [],
      recommendations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(props: ReconstituteMaintenanceProps): Maintenance {
    return new Maintenance(props);
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

  get type(): MaintenanceType {
    return this.props.type;
  }

  get status(): MaintenanceStatus {
    return this.props.status;
  }

  get description(): string {
    return this.props.description;
  }

  get mileage(): number {
    return this.props.mileage;
  }

  get scheduledDate(): Date {
    return this.props.scheduledDate;
  }

  get completedDate(): Date | undefined {
    return this.props.completedDate;
  }

  private updateLastModified(): void {
    this.props.updatedAt = new Date();
  }

  // Méthodes de mise à jour du statut
  public start(): void {
    if (this.props.status !== MaintenanceStatus.PLANNED) {
      throw new MaintenanceValidationError(
        'Can only start maintenance that is planned',
      );
    }

    this.props.status = MaintenanceStatus.IN_PROGRESS;
    this.props.startDate = new Date();
    this.updateLastModified();
  }

  public cancel(): void {
    if (this.props.status === MaintenanceStatus.COMPLETED) {
      throw new MaintenanceValidationError(
        'Cannot cancel maintenance that is already completed',
      );
    }

    this.props.status = MaintenanceStatus.CANCELLED;
    this.updateLastModified();
  }

  public addSparePart(sparePart: SparePart): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Cannot add spare parts unless maintenance is in progress',
      );
    }
    this.props.spareParts.push(sparePart);
    this.updateLastModified();
  }

  public removeSparePart(reference: string): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Cannot remove spare parts unless maintenance is in progress',
      );
    }
    this.props.spareParts = this.props.spareParts.filter(
      (part) => part.reference !== reference,
    );
    this.updateLastModified();
  }

  public getSpareParts(): SparePart[] {
    return [...this.props.spareParts];
  }

  public getTotalPartsPrice(): number {
    return this.props.spareParts.reduce(
      (total, part) => total + part.totalPrice,
      0,
    );
  }

  public setCosts(costs: MaintenanceCost): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Cannot set costs unless maintenance is in progress',
      );
    }
    this.props.costs = costs;
    this.updateLastModified();
  }

  public getCosts(): MaintenanceCost | undefined {
    return this.props.costs;
  }

  public complete(): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Can only complete maintenance that is in progress',
      );
    }

    if (!this.props.costs && this.props.type !== MaintenanceType.WARRANTY) {
      throw new MaintenanceValidationError(
        'Cannot complete non-warranty maintenance without setting costs',
      );
    }

    this.props.status = MaintenanceStatus.COMPLETED;
    this.props.completedDate = new Date();
    this.updateLastModified();
  }

  public addRecommendation(recommendation: TechnicianRecommendation): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Cannot add recommendations unless maintenance is in progress',
      );
    }
    this.props.recommendations.push(recommendation);
    this.updateLastModified();
  }

  public getRecommendations(): TechnicianRecommendation[] {
    return [...this.props.recommendations];
  }

  public getRecommendationsByPriority(
    priority: RecommendationPriority,
  ): TechnicianRecommendation[] {
    return this.props.recommendations.filter(
      (rec) => rec.priority === priority,
    );
  }

  public setWarranty(warranty: Warranty): void {
    if (this.props.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new MaintenanceValidationError(
        'Cannot set warranty unless maintenance is in progress',
      );
    }

    if (this.props.type !== MaintenanceType.WARRANTY) {
      throw new MaintenanceValidationError(
        'Can only set warranty for warranty-type maintenance',
      );
    }

    this.props.warranty = warranty;
    this.updateLastModified();
  }

  public getWarranty(): Warranty | undefined {
    return this.props.warranty;
  }

  public isUnderWarranty(currentMileage: number): boolean {
    if (!this.props.warranty) return false;

    return this.props.warranty.isValid(new Date(), currentMileage);
  }
}
