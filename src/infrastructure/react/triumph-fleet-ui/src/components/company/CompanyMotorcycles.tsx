import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Motorcycle } from '@/types/motorcycle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useDealershipStore } from '@/store/dealershipStore';
import { useMotorcycleStore } from '@/store/motorcycleStore';

export function CompanyMotorcycles() {
  const { id } = useParams<{ id: string }>();
  const { 
    currentCompany, 
    fetchCompanyById, 
    companyMotorcycles,
    fetchCompanyMotorcycles,
    isLoading, 
    isLoadingMotorcycles,
    error,
    motorcyclesError
  } = useCompanyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentDealershipMotorcycles, fetchDealershipMotorcycles } = useDealershipStore();
  const { assignMotorcycleToCompany } = useMotorcycleStore();

  const handleAssignMotorcycle = async (motorcycleId: string) => {
    try {
      if (id) {
        await assignMotorcycleToCompany(motorcycleId, id);
        await fetchCompanyMotorcycles(id);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'attribution de la moto:", error);
    }
  };

  useEffect(() => {
    if (currentCompany?.dealershipId && isModalOpen) {
      fetchDealershipMotorcycles(currentCompany.dealershipId, {
        statusFilter: 'AVAILABLE',
        includeInactive: false
      });
    }
  }, [currentCompany?.dealershipId, isModalOpen, fetchDealershipMotorcycles]);

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
      fetchCompanyMotorcycles(id);
    }
  }, [id, fetchCompanyById, fetchCompanyMotorcycles]);

  const columns: ColumnDef<Motorcycle>[] = [
    {
      accessorKey: 'model.type',
      header: 'Modèle',
      cell: ({ row }) => (
        <span>{row.original.model.type.replace('_', ' ')}</span>
      )
    },
    {
      accessorKey: 'vin',
      header: 'VIN',
    },
    {
      accessorKey: 'mileage',
      header: 'Kilométrage',
      cell: ({ row }) => (
        <span>{row.original.mileage} km</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'État',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusConfig = {
          text: '',
          classes: ''
        };

        switch (status) {
          case 'AVAILABLE':
            statusConfig = {
              text: 'Disponible',
              classes: 'bg-green-100 text-green-800'
            };
            break;
          case 'MAINTENANCE':
            statusConfig = {
              text: 'En maintenance',
              classes: 'bg-yellow-100 text-yellow-800'
            };
            break;
          case 'IN_USE':
            statusConfig = {
              text: 'En utilisation',
              classes: 'bg-blue-100 text-blue-800'
            };
            break;
          default:
            statusConfig = {
              text: status,
              classes: 'bg-gray-100 text-gray-800'
            };
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.classes}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
  ];

  if (isLoading || isLoadingMotorcycles) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || motorcyclesError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4">
        <AlertDescription>
          {error || motorcyclesError}
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={() => {
              if (id) {
                fetchCompanyById(id);
                fetchCompanyMotorcycles(id);
              }
            }}
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
        <div className="flex items-center space-x-4">
          <Link to={`/companies/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Motos - {currentCompany?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Gestion des motos de l'entreprise
            </p>
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une moto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Sélectionner une moto à ajouter</DialogTitle>
              <DialogDescription>
                Choisissez une moto disponible dans la concession pour l'ajouter à l'entreprise.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {currentDealershipMotorcycles.length === 0 ? (
                <p className="text-center text-gray-500">
                  Aucune moto disponible dans la concession
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentDealershipMotorcycles.map((motorcycle) => (
                    <div
                      key={motorcycle.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAssignMotorcycle(motorcycle.id)}
                    >
                      <div>
                        <p className="font-medium">{motorcycle.model.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">
                          VIN: {motorcycle.vin}
                        </p>
                        <p className="text-sm text-gray-500">
                          Kilométrage: {motorcycle.mileage} km
                        </p>
                        <p className="text-sm text-gray-500">
                          Catégorie: {motorcycle.model.category}
                        </p>
                        <p className="text-sm text-gray-500">
                          Année: {motorcycle.model.year}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sélectionner
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={companyMotorcycles} />
    </div>
  );
} 