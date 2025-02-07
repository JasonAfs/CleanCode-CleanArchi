import { BaseAuthenticatedDTO } from "../../shared/BaseAuthenticatedDTO";
import { MotorcycleStatus } from "@domain/enums/MotorcycleEnums";

export interface GetDealershipMotorcyclesDTO extends BaseAuthenticatedDTO {
    statusFilter?: MotorcycleStatus;
    includeInactive?: boolean;
}