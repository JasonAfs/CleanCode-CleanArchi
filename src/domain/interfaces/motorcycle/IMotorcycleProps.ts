import { MotorcycleStatus } from '@domain/enums/MotorcycleStatus';
import { MotorcycleModel } from '@domain/enums/MotorcycleModel';
import { MaintenanceSchedule } from '@domain/value-objects/MaintenanceSchedule';
import { VIN } from '@domain/value-objects/VIN';
import { MotorcycleMaintenance } from '@domain/aggregates/maintenance/MotorcycleMaintenance';

export interface MotorcycleProps {
    id: string;
    vin: VIN;
    dealershipId: string;
    model: MotorcycleModel;
    year: number;
    registrationNumber: string;
    status: MotorcycleStatus;
    mileage: number;
    maintenanceSchedule: MaintenanceSchedule;
    maintenanceHistory: MotorcycleMaintenance;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateMotorcycleProps {
    vin: string;
    dealershipId: string;
    model: MotorcycleModel;
    year: number;
    registrationNumber: string;
    mileage: number;
}

export interface ReconstituteMotorcycleProps {
    id: string;
    vin: VIN;
    dealershipId: string;
    model: MotorcycleModel;
    year: number;
    registrationNumber: string;
    status: MotorcycleStatus;
    mileage: number;
    maintenanceHistory: MotorcycleMaintenance;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}