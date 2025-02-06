export enum MotorcycleModel {
    STREET_TRIPLE_765_RS = 'Street Triple 765 RS',
    TIGER_900_RALLY_PRO = 'Tiger 900 Rally Pro',
    SPEED_TRIPLE_1200_RS = 'Speed Triple 1200 RS',
    TRIDENT_660 = 'Trident 660',
    ROCKET_3_GT = 'Rocket 3 GT',
    BONNEVILLE_T120 = 'Bonneville T120',
    TIGER_1200_GT_EXPLORER = 'Tiger 1200 GT Explorer',
    SCRAMBLER_1200_XE = 'Scrambler 1200 XE'
}

export enum MotorcycleStatus {
    AVAILABLE = 'AVAILABLE',           // Disponible pour attribution à une entreprise
    IN_USE = 'IN_USE',                // Utilisée par une entreprise
    IN_MAINTENANCE = 'IN_MAINTENANCE', // En maintenance
    IN_TRANSIT = 'IN_TRANSIT',        // En transit entre concessions
    OUT_OF_SERVICE = 'OUT_OF_SERVICE' // Hors service (accident, panne majeure...)
}

// Caractéristiques par modèle
export interface ModelCharacteristics {
    displacement: number;  // en cc
    category: string;
    maintenanceInterval: number; // en km
}

export const MODEL_CHARACTERISTICS: Record<MotorcycleModel, ModelCharacteristics> = {
    [MotorcycleModel.STREET_TRIPLE_765_RS]: {
        displacement: 765,
        category: 'Roadster',
        maintenanceInterval: 10000
    },
    [MotorcycleModel.TIGER_900_RALLY_PRO]: {
        displacement: 900,
        category: 'Adventure',
        maintenanceInterval: 12000
    },
    [MotorcycleModel.SPEED_TRIPLE_1200_RS]: {
        displacement: 1200,
        category: 'Roadster',
        maintenanceInterval: 10000
    },
    [MotorcycleModel.TRIDENT_660]: {
        displacement: 660,
        category: 'Roadster',
        maintenanceInterval: 10000
    },
    [MotorcycleModel.ROCKET_3_GT]: {
        displacement: 2458,
        category: 'Cruiser',
        maintenanceInterval: 10000
    },
    [MotorcycleModel.BONNEVILLE_T120]: {
        displacement: 1200,
        category: 'Modern Classics',
        maintenanceInterval: 10000
    },
    [MotorcycleModel.TIGER_1200_GT_EXPLORER]: {
        displacement: 1200,
        category: 'Adventure',
        maintenanceInterval: 12000
    },
    [MotorcycleModel.SCRAMBLER_1200_XE]: {
        displacement: 1200,
        category: 'Modern Classics',
        maintenanceInterval: 10000
    }
}