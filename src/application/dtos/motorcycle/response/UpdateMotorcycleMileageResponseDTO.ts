export interface UpdateMotorcycleMileageResponseDTO {
  success: boolean;
  message: string;
  motorcycleId: string;
  previousMileage: number;
  newMileage: number;
}
