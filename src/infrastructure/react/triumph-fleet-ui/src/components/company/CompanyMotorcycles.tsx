import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Motorcycle } from '@/types/motorcycle';

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

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
      fetchCompanyMotorcycles(id);
    }
  }, [id, fetchCompanyById, fetchCompanyMotorcycles]);

  const columns: ColumnDef<Motorcycle>[] = [
    {
      accessorKey: 'model',
      header: 'Modèle',
    },
    {
      accessorKey: 'registrationNumber',
      header: 'Immatriculation',
    },
    {
      accessorKey: 'mileage',
      header: 'Kilométrage',
    },
    {
      accessorKey: 'status',
      header: 'État',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.status === 'AVAILABLE'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.original.status === 'AVAILABLE' ? 'Disponible' : 'En maintenance'}
        </span>
      ),
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une moto
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={companyMotorcycles} 
      />
    </div>
  );
} 