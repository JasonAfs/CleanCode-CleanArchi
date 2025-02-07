export interface MotorcycleModel {
    type: string;
    year: number;
    displacement: number;
    category: string;
    maintenanceInterval: number;
  }
  
  export interface MotorcycleHolder {
    dealershipId: string;
    companyId?: string;
    assignedAt: Date;
  }
  
  export interface Motorcycle {
    id: string;
    vin: string;
    model: MotorcycleModel;
    color: string;
    mileage: number;
    status: string;
    holder: MotorcycleHolder;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }