import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDealershipStore } from '@/store/dealershipStore';

export function DealershipEmployees() {
  const { id } = useParams<{ id: string }>();
  const {
    currentDealershipEmployees,
    fetchDealershipEmployees,
    isLoading,
    error,
  } = useDealershipStore();

  useEffect(() => {
    if (id) {
      fetchDealershipEmployees(id);
    }
  }, [id, fetchDealershipEmployees]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employés de la concession</h1>
      <div className="grid gap-4">
        {currentDealershipEmployees.map((employee) => (
          <div
            key={employee.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-sm text-gray-500">{employee.role}</p>
              </div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
