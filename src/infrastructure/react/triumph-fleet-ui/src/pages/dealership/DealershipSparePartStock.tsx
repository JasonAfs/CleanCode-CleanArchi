import { useEffect, useState } from 'react';
import { useSparePartOrderStore } from '@/store/sparePartOrderStore';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, History } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SparePartStock, SparePartOrder } from '@/services/sparePart/HttpSparePartOrderService';
import { NewOrderDialog } from '@/components/spare-part/NewOrderDialog';

export function DealershipSparePartStock() {
  const { 
    stock, 
    orders, 
    isLoading, 
    error, 
    fetchStock, 
    fetchOrderHistory,
  } = useSparePartOrderStore();
  const [activeTab, setActiveTab] = useState('stock');

  const stockColumns: ColumnDef<SparePartStock>[] = [
    {
      accessorKey: 'reference',
      header: 'Référence',
    },
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'currentQuantity',
      header: 'Quantité',
      cell: ({ row }) => (
        <span className={`${row.original.isLowStock ? 'text-red-500 font-bold' : ''}`}>
          {row.original.currentQuantity}
        </span>
      ),
    },
    {
      accessorKey: 'minimumThreshold',
      header: 'Seuil minimum',
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
    },
    {
      accessorKey: 'unitPrice',
      header: 'Prix unitaire',
      cell: ({ row }) => `${row.original.unitPrice} €`,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleOrder(row.original)}
          disabled={!row.original.isLowStock}
        >
          Commander
        </Button>
      ),
    },
  ];

  const orderColumns: ColumnDef<SparePartOrder>[] = [
    {
      accessorKey: 'orderDate',
      header: 'Date de commande',
      cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString('fr-FR'),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <span className={getOrderStatusClass(row.original.status)}>
          {getOrderStatusLabel(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Montant total',
      cell: ({ row }) => `${row.original.totalAmount} €`,
    },
    {
      accessorKey: 'estimatedDeliveryDate',
      header: 'Livraison estimée',
      cell: ({ row }) => row.original.estimatedDeliveryDate 
        ? new Date(row.original.estimatedDeliveryDate).toLocaleDateString('fr-FR')
        : 'Non définie',
    },
  ];

  useEffect(() => {
    // Appeler directement les méthodes comme dans MaintenanceList
    fetchStock();
    fetchOrderHistory();
  }, [fetchStock, fetchOrderHistory]);

  const handleOrder = (sparePart: SparePartStock) => {
    // TODO: Implémenter la logique de commande
    console.log('Commander:', sparePart);
  };

  const getOrderStatusClass = (status: string) => {
    const classes = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs ${classes[status as keyof typeof classes]}`;
  };

  const getOrderStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée',
    };
    return labels[status as keyof typeof labels];
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
            onClick={() => fetchStock()}
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
        <h1 className="text-2xl font-bold">Gestion des pièces détachées</h1>
        <NewOrderDialog />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="orders">
            <History className="mr-2 h-4 w-4" />
            Historique des commandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <DataTable 
            columns={stockColumns} 
            data={stock}
          />
        </TabsContent>

        <TabsContent value="orders">
          <DataTable 
            columns={orderColumns} 
            data={orders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 