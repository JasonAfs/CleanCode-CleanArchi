export interface DealershipResponseDTO {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    contactInfo: {
        phoneNumber: string;
        email: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}