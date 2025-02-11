import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDealershipStore } from '@/store/dealershipStore';
import { useMotorcycleStore } from '@/store/motorcycleStore';
import { Button } from '@/components/ui/button';

export function DealershipMotorcycles() {
  const { id } = useParams<{ id: string }>();
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<
    string | null
  >(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    currentDealershipMotorcycles,
    fetchDealershipMotorcycles,
    isLoading: isLoadingMotorcycles,
    error: motorcyclesError,
  } = useDealershipStore();

  const {
    dealerships,
    fetchDealerships,
    isLoading: isLoadingDealerships,
  } = useDealershipStore();

  const { transferMotorcycle, releaseMotorcycleFromCompany } =
    useMotorcycleStore();

  useEffect(() => {
    if (!id) return;
    fetchDealershipMotorcycles(id);
    fetchDealerships();
  }, [id, fetchDealershipMotorcycles, fetchDealerships]);

  const handleTransferClick = (motorcycleId: string) => {
    // Trouver la moto sélectionnée
    const motorcycle = currentDealershipMotorcycles.find(
      (m) => m.id === motorcycleId,
    );

    if (motorcycle?.holder?.companyId) {
      // Si la moto est assignée à une entreprise, afficher un message de confirmation
      if (
        window.confirm(
          'Cette moto est actuellement assignée à une entreprise. Voulez-vous la libérer avant de la transférer ?',
        )
      ) {
        // Appeler l'API pour libérer la moto de l'entreprise
        releaseMotorcycleFromCompany(motorcycleId)
          .then(async () => {
            // D'abord rafraîchir les données
            await fetchDealerships();
            await fetchDealershipMotorcycles(id!);

            // Attendre un court instant pour s'assurer que le store est mis à jour
            setTimeout(() => {
              setSelectedMotorcycleId(motorcycleId);
              setIsTransferModalOpen(true);
            }, 100);
          })
          .catch((error) => {
            console.error('Erreur lors de la libération de la moto:', error);
            setTransferError(
              error instanceof Error
                ? error.message
                : 'Une erreur est survenue lors de la libération de la moto',
            );
          });
      }
    } else {
      // Si la moto n'est pas assignée à une entreprise, procéder normalement
      // Rafraîchir les données avant d'ouvrir le modal
      fetchDealerships().then(() => {
        setSelectedMotorcycleId(motorcycleId);
        setIsTransferModalOpen(true);
      });
    }
  };

  const handleTransferConfirm = async (targetDealershipId: string) => {
    if (!selectedMotorcycleId || !id) return;

    try {
      setTransferError(null);
      const response = await transferMotorcycle(
        selectedMotorcycleId,
        targetDealershipId,
      );

      // Utiliser le message de succès retourné par l'API
      setSuccessMessage(response.message);
      setIsTransferModalOpen(false);
      setSelectedMotorcycleId(null);
      fetchDealershipMotorcycles(id);

      // Faire disparaître le message de succès après 5 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      setTransferError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors du transfert',
      );
    }
  };

  // Ajouter un useEffect pour recharger les données quand le modal s'ouvre
  useEffect(() => {
    if (isTransferModalOpen) {
      fetchDealerships();
    }
  }, [isTransferModalOpen, fetchDealerships]);

  if (isLoadingMotorcycles || isLoadingDealerships) {
    return <div>Chargement...</div>;
  }

  if (motorcyclesError) {
    return <div className="text-red-500">Erreur: {motorcyclesError}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg">
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-green-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
              </svg>
            </div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold">Motos de la concession</h1>
      <div className="grid gap-4">
        {currentDealershipMotorcycles.map((motorcycle) => (
          <div
            key={motorcycle.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{motorcycle.model.type}</h3>
                <p className="text-sm text-gray-500">{motorcycle.status}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  VIN: {motorcycle.vin}
                </div>
                <Button
                  onClick={() => handleTransferClick(motorcycle.id)}
                  className=""
                >
                  Transférer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de transfert */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Sélectionner la concession de destination
            </h2>

            {transferError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {transferError}
              </div>
            )}

            <div className="space-y-2">
              {dealerships.length === 0 ? (
                <div className="text-gray-500">
                  Chargement des concessions...
                </div>
              ) : (
                dealerships
                  .filter((dealership) => dealership.id !== id)
                  .map((dealership) => (
                    <button
                      key={dealership.id}
                      onClick={() => handleTransferConfirm(dealership.id)}
                      className="w-full p-2 text-left hover:bg-gray-100 rounded"
                    >
                      {dealership.name}
                    </button>
                  ))
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
