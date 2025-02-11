import { useEffect } from 'react';
import { useSparePartStore } from '@/store/sparePartStore';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@domain/enums/UserRole';
import { SparePartDialog } from '@/components/spare-part/SparePartDialog';
import { useSparePartDialogStore } from '@/components/spare-part/SparePartDialog';
import { columns } from '@/components/spare-part/SparePartColumns';

export function SpareParts() {
  const { user } = useAuth();
  const { spareParts, isLoading, error, fetchSpareParts } = useSparePartStore();
  const { toggleModal } = useSparePartDialogStore();

  useEffect(() => {
    fetchSpareParts();
  }, [fetchSpareParts]);

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
          <Button variant="outline" className="ml-2" onClick={fetchSpareParts}>
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
          <h1 className="text-2xl font-bold">Pièces Détachées</h1>
          <p className="text-sm text-gray-500">
            Gestion du stock des pièces détachées
          </p>
        </div>
        {user?.role === UserRole.TRIUMPH_ADMIN && (
          <Button onClick={toggleModal}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une pièce
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={spareParts} />
      <SparePartDialog />
    </div>
  );
}
