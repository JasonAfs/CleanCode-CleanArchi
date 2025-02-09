export enum MotorcycleModel {
  STREET_TRIPLE_765_RS = 'STREET_TRIPLE_765_RS',
  TIGER_900_RALLY_PRO = 'TIGER_900_RALLY_PRO',
  SPEED_TRIPLE_1200_RS = 'SPEED_TRIPLE_1200_RS',
  TRIDENT_660 = 'TRIDENT_660',
  ROCKET_3_GT = 'ROCKET_3_GT',
  BONNEVILLE_T120 = 'BONNEVILLE_T120',
  TIGER_1200_GT_EXPLORER = 'TIGER_1200_GT_EXPLORER',
  SCRAMBLER_1200_XE = 'SCRAMBLER_1200_XE',
}

export const MotorcycleModelDisplayNames: Record<MotorcycleModel, string> = {
  [MotorcycleModel.STREET_TRIPLE_765_RS]: 'Street Triple 765 RS',
  [MotorcycleModel.TIGER_900_RALLY_PRO]: 'Tiger 900 Rally Pro',
  [MotorcycleModel.SPEED_TRIPLE_1200_RS]: 'Speed Triple 1200 RS',
  [MotorcycleModel.TRIDENT_660]: 'Trident 660',
  [MotorcycleModel.ROCKET_3_GT]: 'Rocket 3 GT',
  [MotorcycleModel.BONNEVILLE_T120]: 'Bonneville T120',
  [MotorcycleModel.TIGER_1200_GT_EXPLORER]: 'Tiger 1200 GT Explorer',
  [MotorcycleModel.SCRAMBLER_1200_XE]: 'Scrambler 1200 XE',
};

export enum MotorcycleStatus {
  AVAILABLE = 'AVAILABLE', // Disponible pour attribution à une entreprise
  MAINTENANCE = 'MAINTENANCE', // En maintenance
  IN_USE = 'IN_USE', // Utilisée par une entreprise
  IN_TRANSIT = 'IN_TRANSIT', // En transit entre concessions
  OUT_OF_SERVICE = 'OUT_OF_SERVICE', // Hors service (accident, panne majeure...)
}

// Caractéristiques par modèle
export interface ModelCharacteristics {
  displacement: number;
  category: string;
  maintenanceInterval: {
    kilometers: number;
    months: number;
  };
}

export const MODEL_CHARACTERISTICS: Record<
  MotorcycleModel,
  ModelCharacteristics
> = {
  [MotorcycleModel.STREET_TRIPLE_765_RS]: {
    displacement: 765,
    category: 'Roadster',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
  [MotorcycleModel.TIGER_900_RALLY_PRO]: {
    displacement: 900,
    category: 'Adventure',
    maintenanceInterval: {
      kilometers: 12000,
      months: 12,
    },
  },
  [MotorcycleModel.SPEED_TRIPLE_1200_RS]: {
    displacement: 1200,
    category: 'Roadster',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
  [MotorcycleModel.TRIDENT_660]: {
    displacement: 660,
    category: 'Roadster',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
  [MotorcycleModel.ROCKET_3_GT]: {
    displacement: 2458,
    category: 'Cruiser',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
  [MotorcycleModel.BONNEVILLE_T120]: {
    displacement: 1200,
    category: 'Modern Classics',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
  [MotorcycleModel.TIGER_1200_GT_EXPLORER]: {
    displacement: 1200,
    category: 'Adventure',
    maintenanceInterval: {
      kilometers: 12000,
      months: 12,
    },
  },
  [MotorcycleModel.SCRAMBLER_1200_XE]: {
    displacement: 1200,
    category: 'Modern Classics',
    maintenanceInterval: {
      kilometers: 10000,
      months: 12,
    },
  },
};
