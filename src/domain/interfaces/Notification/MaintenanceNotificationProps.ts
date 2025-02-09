export interface MaintenanceNotificationProps {
    id: string;
    motorcycleId: string;
    dealershipId: string;
    companyId?: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  }