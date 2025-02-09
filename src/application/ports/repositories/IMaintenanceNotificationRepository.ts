import { MaintenanceNotification } from '@domain/entities/MaintenanceNotificationEntity';

export interface IMaintenanceNotificationRepository {
  // Opérations de base
  create(notification: MaintenanceNotification): Promise<void>;
  update(notification: MaintenanceNotification): Promise<void>;
  findById(id: string): Promise<MaintenanceNotification | null>;
  delete(id: string): Promise<void>;

  // Recherches spécifiques
  findByMotorcycleId(motorcycleId: string): Promise<MaintenanceNotification[]>;
  findByDealershipId(dealershipId: string): Promise<MaintenanceNotification[]>;
  findByCompanyId(companyId: string): Promise<MaintenanceNotification[]>;

  // Gestion des notifications non lues
  findUnreadByDealershipId(
    dealershipId: string,
  ): Promise<MaintenanceNotification[]>;
  findUnreadByCompanyId(companyId: string): Promise<MaintenanceNotification[]>;

  // Actions sur les notifications
  markAsRead(id: string): Promise<void>;
  markAllAsRead(dealershipId?: string, companyId?: string): Promise<void>;

  // Recherches pour les rapports
  findByDateRange(
    startDate: Date,
    endDate: Date,
    dealershipId?: string,
    companyId?: string,
  ): Promise<MaintenanceNotification[]>;

  // Vérifications
  exists(id: string): Promise<boolean>;
}
