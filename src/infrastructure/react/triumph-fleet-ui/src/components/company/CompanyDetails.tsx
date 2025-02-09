import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyStore } from '@/store/companyStore';
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
import { useCompanyDialogStore } from '@/components/company/EditCompanyDialog';

export function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentCompany, fetchCompanyById, isLoading, error } = useCompanyStore();
  console.log(currentCompany?.address);

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
    }
  }, [id, fetchCompanyById]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  if (!currentCompany) {
    return <div>Entreprise non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/companies">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{currentCompany.name}</h1>
        </div>
        <div className="flex space-x-4">
          <Link to={`/companies/${id}/employees`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Employés</span>
            </Button>
          </Link>
          <Link to={`/companies/${id}/motorcycles`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Bike className="h-4 w-4" />
              <span>Motos</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={() => {
              // Ouvrir le dialog de modification
              useCompanyDialogStore.getState().setData(currentCompany);
            }}
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Détails de l'entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p>{currentCompany.address.street}</p>
                <p>
                  {currentCompany.address.postalCode}{' '}
                  {currentCompany.address.city}
                </p>
                <p>{currentCompany.address.country}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <p>{currentCompany.contactInfo.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <p>{currentCompany.contactInfo.email}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentCompany.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentCompany.isActive ? 'Actif' : 'Inactif'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Aperçu des données clés</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Ajoutez ici les statistiques pertinentes */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 