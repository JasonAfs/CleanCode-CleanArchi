import { DomainError } from '@domain/errors/DomainError';
import { ITechnicianRecommendationProps } from '@domain/interfaces/maintenance/ITechnicianRecommendationProps';
import { RecommendationPriority } from '@domain/enums/MaintenanceEnums';
import { randomUUID } from 'crypto';

export class TechnicianRecommendation {
  private readonly props: ITechnicianRecommendationProps;

  private constructor(props: ITechnicianRecommendationProps) {
    this.props = props;
  }

  public static create(
    description: string,
    priority: RecommendationPriority,
    technicianId: string,
  ): TechnicianRecommendation {
    if (!description || description.trim().length === 0) {
      throw new TechnicianRecommendationError('Description is required');
    }

    if (!technicianId || technicianId.trim().length === 0) {
      throw new TechnicianRecommendationError('Technician ID is required');
    }

    return new TechnicianRecommendation({
      id: randomUUID(),
      description: description.trim(),
      priority,
      technicianId: technicianId.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): RecommendationPriority {
    return this.props.priority;
  }

  get technicianId(): string {
    return this.props.technicianId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

export class TechnicianRecommendationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
