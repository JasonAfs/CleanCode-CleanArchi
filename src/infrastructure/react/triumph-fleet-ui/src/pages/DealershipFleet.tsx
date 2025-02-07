import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, Edit2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDealershipStore } from '@/store/dealershipStore';
import { useMotorcycleStore } from '@/store/motorcycleStore';
import { Motorcycle } from '@/types/motorcycle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { MotorcycleStatus } from '@domain/enums/MotorcycleEnums';

const updateMileageSchema = z.object({
  mileage: z
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .max(999999, 'Le kilométrage ne peut pas dépasser 999 999 km'),
});

type UpdateMileageForm = z.infer<typeof updateMileageSchema>;

export function DealershipFleet() {
  const {
    currentDealershipMotorcycles,
    fetchDealershipMotorcycles,
    isLoading: isDealershipLoading,
    error: dealershipError,
  } = useDealershipStore();

  const {
    updateMotorcycleMileage,
    isLoading: isMotorcycleLoading,
    error: motorcycleError,
  } = useMotorcycleStore();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] =
    useState<Motorcycle | null>(null);
  const [isUpdateMileageOpen, setIsUpdateMileageOpen] = useState(false);

  const form = useForm<UpdateMileageForm>({
    resolver: zodResolver(updateMileageSchema),
    defaultValues: {
      mileage: selectedMotorcycle?.mileage || 0,
    },
  });

  useEffect(() => {
    fetchDealershipMotorcycles({
      statusFilter: statusFilter === 'ALL' ? '' : statusFilter,
      includeInactive,
    }).catch(console.error);
  }, [fetchDealershipMotorcycles, statusFilter, includeInactive]);

  useEffect(() => {
    if (selectedMotorcycle) {
      form.reset({
        mileage: selectedMotorcycle.mileage,
      });
    }
  }, [selectedMotorcycle, form]);

  const onSubmit = async (data: UpdateMileageForm) => {
    if (!selectedMotorcycle) return;

    try {
      await updateMotorcycleMileage(selectedMotorcycle.id, data.mileage);
      await fetchDealershipMotorcycles({
        statusFilter: statusFilter === 'ALL' ? '' : statusFilter,
        includeInactive,
      });
      setIsUpdateMileageOpen(false);
      setSelectedMotorcycle(null);
    } catch (error) {
      console.error('Failed to update mileage:', error);
    }
  };

  const columns: ColumnDef<Motorcycle>[] = [
    {
      accessorKey: 'vin',
      header: 'VIN',
    },
    {
      accessorKey: 'model',
      header: 'Modèle',
      cell: ({ row }) => {
        const model = row.original.model;
        return (
          <div>
            <div>{model.type}</div>
            <div className="text-sm text-gray-500">
              {model.year} - {model.category}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'color',
      header: 'Couleur',
    },
    {
      accessorKey: 'mileage',
      header: 'Kilométrage',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.mileage.toLocaleString()} km</span>
          <Dialog
            open={
              isUpdateMileageOpen && selectedMotorcycle?.id === row.original.id
            }
            onOpenChange={(open) => {
              setIsUpdateMileageOpen(open);
              if (!open) setSelectedMotorcycle(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedMotorcycle(row.original)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le kilométrage</DialogTitle>
                <DialogDescription>
                  Moto: {row.original.model.type} (VIN: {row.original.vin})
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau kilométrage (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsUpdateMileageOpen(false);
                        setSelectedMotorcycle(null);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">Mettre à jour</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs 
                        ${
                          row.original.status === MotorcycleStatus.AVAILABLE
                            ? 'bg-green-100 text-green-800'
                            : row.original.status === MotorcycleStatus.IN_USE
                              ? 'bg-blue-100 text-blue-800'
                              : row.original.status ===
                                  MotorcycleStatus.IN_MAINTENANCE
                                ? 'bg-yellow-100 text-yellow-800'
                                : row.original.status ===
                                    MotorcycleStatus.IN_TRANSIT
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                        }`}
        >
          {row.original.status === MotorcycleStatus.AVAILABLE
            ? 'Disponible'
            : row.original.status === MotorcycleStatus.IN_USE
              ? 'En utilisation'
              : row.original.status === MotorcycleStatus.IN_MAINTENANCE
                ? 'En maintenance'
                : row.original.status === MotorcycleStatus.IN_TRANSIT
                  ? 'En transit'
                  : 'Hors service'}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'État',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.original.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
  ];

  if (isDealershipLoading || isMotorcycleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (dealershipError || motorcycleError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4">
        <AlertDescription>
          {dealershipError || motorcycleError}
          <Button
            variant="outline"
            className="ml-2"
            onClick={() =>
              fetchDealershipMotorcycles({
                statusFilter,
                includeInactive,
              })
            }
          >
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion de la flotte</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
              id="inactive-filter"
            />
            <Label htmlFor="inactive-filter">Inclure inactifs</Label>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous</SelectItem>
              <SelectItem value={MotorcycleStatus.AVAILABLE}>
                Disponible
              </SelectItem>
              <SelectItem value={MotorcycleStatus.IN_USE}>
                En utilisation
              </SelectItem>
              <SelectItem value={MotorcycleStatus.IN_MAINTENANCE}>
                En maintenance
              </SelectItem>
              <SelectItem value={MotorcycleStatus.IN_TRANSIT}>
                En transit
              </SelectItem>
              <SelectItem value={MotorcycleStatus.OUT_OF_SERVICE}>
                Hors service
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={currentDealershipMotorcycles || []} />
    </div>
  );
}
