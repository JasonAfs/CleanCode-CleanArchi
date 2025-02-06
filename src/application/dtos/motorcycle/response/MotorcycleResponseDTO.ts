import { MotorcycleStatus, MotorcycleModel } from '@domain/enums/MotorcycleEnums';

export interface MotorcycleResponseDTO {
    id: string;
    vin: string;
    model: {
        type: MotorcycleModel;
        year: number;
        displacement: number;
        category: string;
        maintenanceInterval: number;
    };
    color: string;
    mileage: number;
    status: MotorcycleStatus;
    holder: {
        dealershipId: string;
        companyId?: string;
        assignedAt: Date;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}