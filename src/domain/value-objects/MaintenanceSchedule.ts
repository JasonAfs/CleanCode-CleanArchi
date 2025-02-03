import { MotorcycleModel } from '@domain/enums/MotorcycleModel';

export interface MaintenanceInterval {
    distance: number; 
    timePeriod: number; 
}

export class MaintenanceSchedule {
    private static readonly scheduleMap = new Map<MotorcycleModel, MaintenanceInterval>([
        [MotorcycleModel.STREET_TRIPLE, { distance: 10000, timePeriod: 12 }],
        [MotorcycleModel.TIGER_SPORT_660, { distance: 16000, timePeriod: 12 }],
        [MotorcycleModel.SPEED_TRIPLE, { distance: 12000, timePeriod: 12 }],
        [MotorcycleModel.ROCKET_3, { distance: 16000, timePeriod: 12 }],
        [MotorcycleModel.TRIDENT, { distance: 10000, timePeriod: 12 }],
        [MotorcycleModel.BONNEVILLE, { distance: 10000, timePeriod: 12 }]
    ]);

    private constructor(
        private readonly model: MotorcycleModel,
        private readonly interval: MaintenanceInterval
    ) {}

    public static forModel(model: MotorcycleModel): MaintenanceSchedule {
        const interval = this.scheduleMap.get(model);
        if (!interval) {
            throw new Error(`No maintenance schedule defined for model: ${model}`);
        }
        return new MaintenanceSchedule(model, interval);
    }

    public getNextMaintenanceDate(lastMaintenanceDate: Date | null): Date {
        const baseDate = lastMaintenanceDate || new Date();
        return new Date(baseDate.setMonth(baseDate.getMonth() + this.interval.timePeriod));
    }

    public getNextMaintenanceDistance(currentMileage: number): number {
        return currentMileage + this.interval.distance;
    }

    public isMaintenanceRequired(currentMileage: number, lastMaintenanceDate: Date | null): boolean {
        if (!lastMaintenanceDate) {
            return true;
        }

        const nextMaintenanceDate = this.getNextMaintenanceDate(lastMaintenanceDate);
        const today = new Date();
        const timeBasedMaintenanceRequired = today >= nextMaintenanceDate;

        return timeBasedMaintenanceRequired || 
               currentMileage >= this.getNextMaintenanceDistance(currentMileage - this.interval.distance);
    }

    get maintenanceInterval(): MaintenanceInterval {
        return { ...this.interval };
    }

    get motorcycleModel(): MotorcycleModel {
        return this.model;
    }
}