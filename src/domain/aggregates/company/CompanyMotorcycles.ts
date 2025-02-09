import { Motorcycle } from '@domain/entities/MotorcycleEntity';
import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';
import { CompanyMotorcyclesError } from '@domain/errors/motorcycle/CompanyMotorcyclesError';



export class CompanyMotorcycles {
   private constructor(private readonly motorcycles: Motorcycle[]) {}

   public static create(): CompanyMotorcycles {
       return new CompanyMotorcycles([]);
   }

   public addMotorcycle(motorcycle: Motorcycle): CompanyMotorcycles {
       if (!motorcycle) {
           throw new CompanyMotorcyclesError('Motorcycle cannot be null');
       }
       return new CompanyMotorcycles([...this.motorcycles, motorcycle]);
   }

   public removeMotorcycle(motorcycleId: string): CompanyMotorcycles {
       const motorcycle = this.getMotorcycleById(motorcycleId);
       if (!motorcycle) {
           throw new CompanyMotorcyclesError('Motorcycle not found in this company');
       }
       
       const newMotorcycles = this.motorcycles.filter(
           (moto) => moto.id !== motorcycleId
       );

       return new CompanyMotorcycles(newMotorcycles);
   }

   public hasMotorcycle(motorcycleId: string): boolean {
       return this.motorcycles.some((motorcycle) => motorcycle.id === motorcycleId);
   }

   public getMotorcycleById(motorcycleId: string): Motorcycle | undefined {
       return this.motorcycles.find((motorcycle) => motorcycle.id === motorcycleId);
   }

   public getAll(): Motorcycle[] {
       return [...this.motorcycles];
   }

   public getByStatus(status: MotorcycleStatus): Motorcycle[] {
       return this.motorcycles.filter(
           (motorcycle) => motorcycle.status === status
       );
   }

   public getAvailableMotorcycles(): Motorcycle[] {
       return this.getByStatus(MotorcycleStatus.AVAILABLE);
   }

   public getInMaintenanceMotorcycles(): Motorcycle[] {
       return this.getByStatus(MotorcycleStatus.MAINTENANCE);
   }

   public getInUseMotorcycles(): Motorcycle[] {
       return this.getByStatus(MotorcycleStatus.IN_USE);
   }

   get totalMotorcycles(): number {
       return this.motorcycles.length;
   }
}