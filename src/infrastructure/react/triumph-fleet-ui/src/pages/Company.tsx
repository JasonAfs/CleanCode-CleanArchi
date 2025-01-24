import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Company as CompanyType } from '@/types/company';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EditCompanyDialog,
  useCompanyDialogStore,
} from '@/components/company/EditCompanyDialog';
import { useCompanyStore } from '@/store/companyStore';

export function Company() {
  const { isOpen, toggleModal, data, setData } = useCompanyDialogStore();
  const { companies, deleteCompany } = useCompanyStore();

  const columns: ColumnDef<CompanyType>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue('status') === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.getValue('status') === 'active' ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const company = row.original;

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
              <DropdownMenuItem onClick={() => setData(company)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteCompany(company.id)}
                className="text-red-600"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des entreprises</h1>
        <Button
          onClick={() =>
            setData({
              id: '',
              name: '',
              email: '',
              status: 'active',
            })
          }
        >
          Ajouter une entreprise
        </Button>
      </div>

      <DataTable columns={columns} data={companies} />
      <EditCompanyDialog
        isOpen={isOpen}
        data={data}
        toggleModal={toggleModal}
      />
    </div>
  );
}
