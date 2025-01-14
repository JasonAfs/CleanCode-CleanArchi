import { MotorcycleStatus } from "@domain/enums/MotorcycleStatus";

export interface UpdateMotorcycleStatusDTO {
    motorcycleId: string;
    status: MotorcycleStatus;
}