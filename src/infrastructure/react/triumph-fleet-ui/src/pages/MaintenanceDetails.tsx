import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MaintenanceDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentMaintenance, fetchMaintenanceDetails, isLoading, error } =
    useMaintenanceStore();

  useEffect(() => {
    if (id) {
      fetchMaintenanceDetails(id);
    }
  }, [id, fetchMaintenanceDetails]);

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
            onClick={() => id && fetchMaintenanceDetails(id)}
          >
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentMaintenance) {
    return <div>Maintenance non trouvée</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/maintenances">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Détails de la maintenance</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p>{currentMaintenance.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <p>{currentMaintenance.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date prévue</p>
                <p>
                  {new Date(
                    currentMaintenance.scheduledDate,
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kilométrage</p>
                <p>{currentMaintenance.mileage} km</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{currentMaintenance.description}</p>
            </div>
          </CardContent>
        </Card>

        {currentMaintenance.spareParts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pièces détachées</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentMaintenance.spareParts.map((part, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{part.name}</span>
                    <span>
                      {part.quantity} x {part.cost}€
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {currentMaintenance.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                {currentMaintenance.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
