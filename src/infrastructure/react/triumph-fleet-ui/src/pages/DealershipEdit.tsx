import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDealershipStore } from '@/store/dealershipStore';
import { EditDealershipDialog, useDealershipDialogStore } from '@/components/dealership/EditDealershipDialog';

export function DealershipEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDealership, fetchDealershipById, isLoading, error } = useDealershipStore();
  const { setData } = useDealershipDialogStore();

  useEffect(() => {
    if (id) {
      fetchDealershipById(id);
    }
  }, [id, fetchDealershipById]);

  useEffect(() => {
    if (currentDealership) {
      setData(currentDealership);
    }
  }, [currentDealership, setData]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  if (!currentDealership) {
    return <div>Concession non trouvée</div>;
  }

  return (
    <EditDealershipDialog
      isOpen={true}
      data={currentDealership}
      toggleModal={() => navigate('/dealership')}
    />
  );
} 