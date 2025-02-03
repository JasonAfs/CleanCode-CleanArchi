import { MotorcycleAssignment } from '@domain/interfaces/motorcycle/IMotorcycleAssignment';
import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleNotAvailableError } from '@domain/errors/motorcycle/MotorcycleNotAvailableError';
import { DomainError } from '@domain/errors/DomainError';
import { randomUUID } from 'crypto';

export class CompanyAssignmentError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class AssignmentDetails implements MotorcycleAssignment {
    private constructor(
        public readonly id: string,
        public readonly motorcycleId: string,
        public readonly companyId: string,
        public readonly assignedAt: Date,
        public isActive: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {}

    public static create(
        companyId: string,
        motorcycleId: string
    ): AssignmentDetails {
        const now = new Date();
        return new AssignmentDetails(
            randomUUID(),
            motorcycleId,
            companyId,
            now,
            true,
            now,
            now
        );
    }

    public deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}

export class CompanyMotorcycles {
    private constructor(
        private readonly assignments: AssignmentDetails[],
        private readonly companyId: string
    ) {}

    public static create(companyId: string): CompanyMotorcycles {
        if (!companyId?.trim()) {
            throw new CompanyAssignmentError('Company ID is required');
        }
        return new CompanyMotorcycles([], companyId.trim());
    }

    public static reconstitute(assignments: MotorcycleAssignment[], companyId: string): CompanyMotorcycles {
        if (!companyId?.trim()) {
            throw new CompanyAssignmentError('Company ID is required');
        }
        return new CompanyMotorcycles(
            assignments.map(a => AssignmentDetails.create(a.companyId, a.motorcycleId)),
            companyId.trim()
        );
    }

    public assignMotorcycle(motorcycle: Motorcycle): CompanyMotorcycles {
        // Vérifications
        if (!motorcycle.isAvailable()) {
            throw new MotorcycleNotAvailableError(motorcycle.id);
        }

        if (this.hasActiveAssignment(motorcycle.id)) {
            throw new CompanyAssignmentError('Motorcycle is already assigned to this company');
        }

        // Création de l'assignation
        motorcycle.markAsInUse();
        const assignment = AssignmentDetails.create(this.companyId, motorcycle.id);

        // Retourne un nouvel état de l'agrégat
        return new CompanyMotorcycles(
            [...this.assignments, assignment],
            this.companyId
        );
    }

    public endAssignment(motorcycleId: string, motorcycle: Motorcycle): CompanyMotorcycles {
        // Recherche de l'assignation active
        const assignment = this.assignments.find(
            a => a.motorcycleId === motorcycleId && a.isActive
        );

        if (!assignment) {
            throw new CompanyAssignmentError('Active assignment not found for this motorcycle');
        }

        // Mise à jour de l'état
        motorcycle.markAsAvailable();
        assignment.deactivate();

        // Retourne un nouvel état de l'agrégat
        return new CompanyMotorcycles(
            [...this.assignments],
            this.companyId
        );
    }

    // Méthodes de requête
    public getActiveAssignments(): MotorcycleAssignment[] {
        return this.assignments
            .filter(a => a.isActive)
            .map(a => ({...a})); // Retourne une copie pour l'immutabilité
    }

    public getAssignmentHistory(): MotorcycleAssignment[] {
        return this.assignments.map(a => ({...a}));
    }

    public hasActiveAssignment(motorcycleId: string): boolean {
        return this.assignments.some(
            a => a.motorcycleId === motorcycleId && a.isActive
        );
    }

    public getAssignmentForMotorcycle(motorcycleId: string): MotorcycleAssignment | undefined {
        const assignment = this.assignments.find(a => a.motorcycleId === motorcycleId && a.isActive);
        return assignment ? {...assignment} : undefined;
    }

    // Statistiques et rapports
    public getAssignmentStatistics() {
        const active = this.getActiveAssignments().length;
        const total = this.assignments.length;
        
        return {
            activeAssignments: active,
            totalAssignments: total,
            historicalAssignments: total - active
        };
    }

    // Méthodes utilitaires
    public get companyIdentifier(): string {
        return this.companyId;
    }

    public get totalAssignments(): number {
        return this.assignments.length;
    }

    public get activeAssignmentsCount(): number {
        return this.getActiveAssignments().length;
    }
}