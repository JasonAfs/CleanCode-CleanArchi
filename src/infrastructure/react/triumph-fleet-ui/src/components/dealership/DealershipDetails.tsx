import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDealershipStore } from '@/store/dealershipStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, ArrowLeft, Edit, Users, Bike } from 'lucide-react';

export function DealershipDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentDealership, fetchDealershipById, isLoading, error } =
    useDealershipStore();

  useEffect(() => {
    if (id) {
      fetchDealershipById(id);
    }
  }, [id, fetchDealershipById]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dealership">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{currentDealership.name}</h1>
        </div>
        <div className="flex space-x-4">
          <Link to={`/dealership/${id}/employees`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Employés</span>
            </Button>
          </Link>
          <Link to={`/dealership/${id}/motorcycles`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Bike className="h-4 w-4" />
              <span>Motos</span>
            </Button>
          </Link>
          <Link to={`/dealership/${id}/edit`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Détails de la concession</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p>{currentDealership.address.street}</p>
                <p>
                  {currentDealership.address.postalCode}{' '}
                  {currentDealership.address.city}
                </p>
                <p>{currentDealership.address.country}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <p>{currentDealership.contactInfo.phoneNumber}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <p>{currentDealership.contactInfo.email}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentDealership.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentDealership.isActive ? 'Actif' : 'Inactif'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Aperçu des données clés</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 