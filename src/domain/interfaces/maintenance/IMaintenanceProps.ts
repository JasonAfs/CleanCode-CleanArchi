export interface SparePart {
    id: string;
    name: string;
    quantity: number;
    cost: number;
}

export enum MaintenanceType {
    PREVENTIVE = 'PREVENTIVE',
    CORRECTIVE = 'CORRECTIVE',
    WARRANTY = 'WARRANTY'
}

export interface MaintenanceRecord {
    id: string;
    date: Date;
    type: MaintenanceType;
    mileage: number;
    description: string;
    spareParts: SparePart[];
    technicianId: string;
    technicianRecommendations?: string;
    totalCost: number;
    warrantyWork: boolean;
    createdAt: Date;
}