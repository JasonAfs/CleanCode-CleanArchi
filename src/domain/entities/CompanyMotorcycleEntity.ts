import { ICompanyMotorcycleProps } from "@domain/interfaces/ICompanyMotorcycleProps";
import { Motorcycle } from "@domain/entities/MotorcycleEntity";
import { MotorcycleNotAvailableError } from "@domain/errors/motorcycle/MotorcycleNotAvailableError";
import { randomUUID } from "crypto";

export class CompanyMotorcycle {
    private readonly props: ICompanyMotorcycleProps;

    private constructor(props: ICompanyMotorcycleProps) {
        this.props = props;
    }

    public static assign(
        companyId: string,
        motorcycle: Motorcycle
    ): CompanyMotorcycle {
        if (!companyId?.trim()) {
            throw new Error("Company ID is required");
        }

        if (!motorcycle.isAvailable()) {
            throw new MotorcycleNotAvailableError(motorcycle.id);
        }

        // Marquer la moto comme en utilisation
        motorcycle.markAsInUse();

        return new CompanyMotorcycle({
            id: randomUUID(),
            companyId: companyId.trim(),
            motorcycleId: motorcycle.id,
            assignedAt: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get companyId(): string {
        return this.props.companyId;
    }

    get motorcycleId(): string {
        return this.props.motorcycleId;
    }

    get assignedAt(): Date {
        return this.props.assignedAt;
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

    private updateLastModified(): void {
        this.props.updatedAt = new Date();
    }

    // Business Methods
    public endAssignment(motorcycle: Motorcycle): void {
        if (!this.props.isActive) {
            throw new Error("Assignment is already inactive");
        }

        motorcycle.markAsAvailable();
        this.props.isActive = false;
        this.updateLastModified();
    }
}