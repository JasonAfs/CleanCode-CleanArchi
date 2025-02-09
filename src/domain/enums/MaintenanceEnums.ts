export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE', // Entretien préventif régulier
  CORRECTIVE = 'CORRECTIVE', // Réparation suite à une panne
  WARRANTY = 'WARRANTY', // Intervention sous garantie
}

export enum MaintenanceStatus {
  PLANNED = 'PLANNED', // Entretien planifié
  IN_PROGRESS = 'IN_PROGRESS', // En cours
  COMPLETED = 'COMPLETED', // Terminé
  CANCELLED = 'CANCELLED', // Annulé
}

export enum RecommendationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum WarrantyType {
  STANDARD = 'STANDARD',
  EXTENDED = 'EXTENDED',
  PARTS = 'PARTS',
}
