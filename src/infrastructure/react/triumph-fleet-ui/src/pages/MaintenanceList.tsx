import { useEffect, useState, useCallback } from 'react';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MaintenanceStatus, MaintenanceType } from '@domain/enums/MaintenanceEnums';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Maintenance } from '@/store/maintenanceStore';

export function MaintenanceList() {
  const { maintenances, isLoading, error, fetchMaintenances } = useMaintenanceStore();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    type: '',
  });

  const columns: ColumnDef<Maintenance>[] = [
    {
      accessorKey: 'scheduledDate',
      header: 'Date prévue',
      cell: ({ row }) => new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(row.getValue('scheduledDate'))),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => row.original.type.replace('_', ' '),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <span className={getStatusClass(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'mileage',
      header: 'Kilométrage',
      cell: ({ row }) => `${row.original.mileage} km`,
    },
  ];

  const handleSearch = useCallback(() => {
    fetchMaintenances({
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      status: filters.status as MaintenanceStatus,
      type: filters.type as MaintenanceType,
    });
  }, [fetchMaintenances, filters]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const getStatusClass = (status: MaintenanceStatus) => {
    const classes = {
      [MaintenanceStatus.PLANNED]: 'bg-blue-100 text-blue-800',
      [MaintenanceStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [MaintenanceStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [MaintenanceStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs ${classes[status]}`;
  };

  const getStatusLabel = (status: MaintenanceStatus) => {
    const labels = {
      [MaintenanceStatus.PLANNED]: 'Planifiée',
      [MaintenanceStatus.IN_PROGRESS]: 'En cours',
      [MaintenanceStatus.COMPLETED]: 'Terminée',
      [MaintenanceStatus.CANCELLED]: 'Annulée',
    };
    return labels[status];
  };

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
          <Button variant="outline" className="ml-2" onClick={handleSearch}>
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Maintenances</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="startDate">Date début</Label>
            <Input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">Date fin</Label>
            <Input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                {Object.values(MaintenanceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                {Object.values(MaintenanceType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleSearch}>
          Rechercher
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={maintenances}
      />
    </div>
  );
} 