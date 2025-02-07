// src/pages/Dealership.tsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dealership as DealershipType } from '@/types/dealership';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EditDealershipDialog,
  useDealershipDialogStore,
} from '@/components/dealership/EditDealershipDialog';
import { useDealershipStore } from '@/store/dealershipStore';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

export function Dealership() {
  const { isOpen, toggleModal, data, setData } = useDealershipDialogStore();
  const { 
    dealerships, 
    fetchDealerships, 
    deleteDealership, 
    isLoading, 
    error 
  } = useDealershipStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDealerships().catch(console.error);
  }, [fetchDealerships]);

  const columns: ColumnDef<DealershipType>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'contactInfo',
      header: 'Contact',
      cell: ({ row }) => {
        const contactInfo = row.original.contactInfo;
        return contactInfo ? (
          <div>
            <div>{contactInfo.email}</div>
            <div className="text-sm text-gray-500">{contactInfo.phoneNumber}</div>
          </div>
        ) : null;
      },
    },
    {
      accessorKey: 'address',
      header: 'Adresse',
      cell: ({ row }) => {
        const address = row.original.address;
        return address ? (
          <div className="max-w-xs">
            <div>{address.street}</div>
            <div className="text-sm text-gray-500">
              {address.postalCode} {address.city}, {address.country}
            </div>
          </div>
        ) : null;
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
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
    {
      id: 'actions',
      cell: ({ row }) => {
        const dealership = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setData(dealership)}
                className="cursor-pointer"
              >
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/dealership/${dealership.id}`)}
                className="cursor-pointer"
              >
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/dealership/${dealership.id}/employees`)}
                className="cursor-pointer"
              >
                Gérer les employés
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/dealership/${dealership.id}/motorcycles`)}
                className="cursor-pointer"
              >
                Gérer les motos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette concession ?')) {
                    deleteDealership(dealership.id);
                  }
                }}
                className="text-red-600 cursor-pointer"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleAddNew = () => {
    setData({
      id: '',
      name: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: ''
      },
      contactInfo: {
        phoneNumber: '',
        email: ''
      },
      isActive: true
    });
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
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={() => fetchDealerships()}
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
        <h1 className="text-2xl font-bold">Gestion des concessions</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une concession
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={dealerships || []}
      />

      <EditDealershipDialog
        isOpen={isOpen}
        data={data}
        toggleModal={toggleModal}
      />
    </div>
  );
}