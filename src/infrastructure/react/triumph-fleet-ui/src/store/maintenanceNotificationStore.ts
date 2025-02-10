import { create } from 'zustand';
import { HttpMaintenanceNotificationService } from '@/services/maintenance/HttpMaintenanceNotificationService';
import { MaintenanceNotification } from '@/types/maintenanceNotification';

interface MaintenanceNotificationStore {
  notifications: MaintenanceNotification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (params?: { includeRead?: boolean }) => Promise<void>;
}

const notificationService = new HttpMaintenanceNotificationService();

export const useMaintenanceNotificationStore =
  create<MaintenanceNotificationStore>((set) => ({
    notifications: [],
    isLoading: false,
    error: null,

    fetchNotifications: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const notifications =
          await notificationService.getNotifications(params);
        set({ notifications, isLoading: false });
      } catch (error) {
        let errorMessage =
          'Une erreur est survenue lors du chargement des notifications';
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          } else {
            errorMessage = error.message;
          }
        }
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },
  }));
