import { useEffect } from 'react';
import { useMaintenanceNotificationStore } from '@/store/maintenanceNotificationStore';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Bell, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaintenanceNotification } from '@/types/maintenanceNotification';

export function MaintenanceNotifications() {
  const { notifications, isLoading, error, fetchNotifications } =
    useMaintenanceNotificationStore();

  useEffect(() => {
    fetchNotifications({ includeRead: false });
  }, [fetchNotifications]);

  const handleIncludeReadChange = (checked: boolean) => {
    fetchNotifications({ includeRead: checked });
  };

  const columns: ColumnDef<MaintenanceNotification>[] = [
    {
      accessorKey: 'message',
      header: 'Message',
    },
    {
      accessorKey: 'isRead',
      header: 'État',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.isRead
              ? 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {row.original.isRead ? 'Lu' : 'Non lu'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span>
          {format(new Date(row.original.createdAt), 'PPp', { locale: fr })}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4">
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => fetchNotifications({ includeRead: false })}
          >
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications de maintenance</h1>
          <p className="text-sm text-gray-500">
            Gérez vos notifications de maintenance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="include-read" onCheckedChange={handleIncludeReadChange} />
          <Label htmlFor="include-read">Inclure les notifications lues</Label>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucune notification
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez aucune notification de maintenance pour le moment.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={notifications} />
      )}
    </div>
  );
}
