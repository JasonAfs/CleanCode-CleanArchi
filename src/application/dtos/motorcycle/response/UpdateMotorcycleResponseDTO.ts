export interface UpdateMotorcycleResponseDTO {
    success: boolean;
    message: string;
    motorcycleId: string;
    updatedFields: {
        vin?: boolean;
        model?: boolean;
        color?: boolean;
        mileage?: boolean;
        dealership?: boolean;
    };
}