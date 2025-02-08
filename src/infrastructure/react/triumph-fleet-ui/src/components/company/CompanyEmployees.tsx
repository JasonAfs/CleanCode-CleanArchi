import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyStore } from '@/store/companyStore';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Employee } from '@/types/employee';

export function CompanyEmployees() {
  const { id } = useParams<{ id: string }>();
  const { currentCompany, fetchCompanyById, isLoading, error } = useCompanyStore();

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
    }
  }, [id, fetchCompanyById]);

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'firstName',
      header: 'Prénom',
    },
    {
      accessorKey: 'lastName',
      header: 'Nom',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Rôle',
    },
    {
      accessorKey: 'isActive',
      header: 'Statut',
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
            onClick={() => id && fetchCompanyById(id)}
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
          <Link to={`/company/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Employés - {currentCompany?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Gestion des employés de l'entreprise
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={currentCompany?.employees || []} 
      />
    </div>
  );
} 