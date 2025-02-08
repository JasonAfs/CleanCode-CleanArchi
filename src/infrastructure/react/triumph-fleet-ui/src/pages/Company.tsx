// src/pages/Company.tsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Company as CompanyType } from '@/types/company';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    EditCompanyDialog,
    useCompanyDialogStore,
} from '@/components/company/EditCompanyDialog';
import { useCompanyStore } from '@/store/companyStore';
import { useNavigate } from 'react-router-dom';

export function Company() {
    const { isOpen, toggleModal, data, setData } = useCompanyDialogStore();
    const { 
        companies, 
        fetchCompanies, 
        deleteCompany, 
        isLoading, 
        error 
    } = useCompanyStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies().catch(console.error);
    }, [fetchCompanies]);

    const columns: ColumnDef<CompanyType>[] = [
        {
            accessorKey: 'name',
            header: 'Nom',
        },
        {
            accessorKey: 'contactInfo',
            header: 'Contact',
            cell: ({ row }) => {
                const contactInfo = row.original.contactInfo;
                return (
                    <div>
                        <div>{contactInfo.email}</div>
                        <div className="text-sm text-gray-500">{contactInfo.phone}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'address',
            header: 'Adresse',
            cell: ({ row }) => {
                const address = row.original.address;
                return (
                    <div>
                        <div>{address.street}</div>
                        <div className="text-sm text-gray-500">
                            {address.postalCode} {address.city}, {address.country}
                        </div>
                    </div>
                );
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
                            <DropdownMenuItem 
                                onClick={() => setData(company)}
                                className="cursor-pointer"
                            >
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate(`/company/${company.id}`)}
                                className="cursor-pointer"
                            >
                                Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate(`/company/${company.id}/employees`)}
                                className="cursor-pointer"
                            >
                                Gérer les employés
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate(`/company/${company.id}/motorcycles`)}
                                className="cursor-pointer"
                            >
                                Gérer les motos
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
                                        deleteCompany(company.id);
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
                        onClick={() => fetchCompanies()}
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
                <h1 className="text-2xl font-bold">Gestion des entreprises</h1>
                <Button onClick={() => setData({
                    id: '',
                    name: '',
                    registrationNumber: '',
                    address: {
                        street: '',
                        city: '',
                        postalCode: '',
                        country: ''
                    },
                    contactInfo: {
                        phone: '',
                        email: ''
                    },
                    isActive: true,
                    employees: []
                })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une entreprise partenaire
                </Button>
            </div>

            <DataTable columns={columns} data={companies || []} />
            <EditCompanyDialog
                isOpen={isOpen}
                data={data}
                toggleModal={toggleModal}
            />
        </div>
    );
}