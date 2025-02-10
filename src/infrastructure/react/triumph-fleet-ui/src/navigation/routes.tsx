import * as React from 'react';
import { Dashboard } from '../pages/Dashboard';
import { Dealership } from '../pages/Dealership';
import { Company } from '../pages/Company';
import { DealershipFleet } from '../pages/DealershipFleet';
import { DealershipDetails } from '../components/dealership/DealershipDetails';
import { UserRole } from '@domain/enums/UserRole';
import { DealershipEmployees } from '../pages/DealershipEmployees';
import { DealershipMotorcycles } from '../pages/DealershipMotorcycles';
import { DealershipEdit } from '../pages/DealershipEdit';
import { CompanyDetails } from '../components/company/CompanyDetails';
import { CompanyEmployees } from '../components/company/CompanyEmployees';
import { CompanyMotorcycles } from '../components/company/CompanyMotorcycles';
import { MaintenanceList } from '../pages/MaintenanceList';
import { MaintenanceNotifications } from '../pages/MaintenanceNotifications';
import { MaintenanceDetails } from '../pages/MaintenanceDetails';
import { SpareParts } from '@/pages/SpareParts';
import { DealershipSparePartStock } from '../pages/dealership/DealershipSparePartStock';
import { SparePartOrderValidation } from '../pages/admin/SparePartOrderValidation';

export interface AppRoute {
  path: string;
  title: string;
  icon?: string;
  allowedRoles: UserRole[];
  element: React.ReactNode;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    allowedRoles: Object.values(UserRole),
    element: <Dashboard/>,
  },
  {
    path: '/dealership',
    title: 'Concessions',
    icon: 'Store',
    // Réservé aux administrateurs uniquement
    allowedRoles: [UserRole.TRIUMPH_ADMIN],
    element: <Dealership />,
  },
  {
    path: '/dealership/:id',
    title: 'Détails de la concession',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_EMPLOYEE
    ],
    element: <DealershipDetails />,
  },
  {
    path: '/dealership/:id/employees',
    title: 'Employés de la concession',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_EMPLOYEE
    ],
    element: <DealershipEmployees />,
  },
  {
    path: '/dealership/:id/motorcycles',
    title: 'Motos de la concession',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_EMPLOYEE
    ],
    element: <DealershipMotorcycles />,
  },
  {
    path: '/dealership/:id/edit',
    title: 'Modifier la concession',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER
    ],
    element: <DealershipEdit />,
  },
  {
    path: '/company',
    title: 'Companies',
    icon: 'Building',
    // Réservé aux administrateurs et aux managers (ici, par exemple, DEALERSHIP_MANAGER)
    allowedRoles: [UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER],
    element: <Company />,
  },
  {
    path: '/fleet',
    title: 'Fleet',
    icon: 'Truck',
    // Accessible aux administrateurs, aux gestionnaires de concession et aux gestionnaires d'entreprise
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER,
    ],
    element: <DealershipFleet />,
  },
  {
    path: '/companies/:id',
    title: 'Détails de l\'entreprise',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER
    ],
    element: <CompanyDetails />,
  },
  {
    path: '/companies/:id/employees',
    title: 'Employés de l\'entreprise',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER
    ],
    element: <CompanyEmployees />,
  },
  {
    path: '/companies/:id/motorcycles',
    title: 'Motos de l\'entreprise',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER
    ],
    element: <CompanyMotorcycles />,
  },
  {
    path: '/maintenances',
    title: 'Maintenances',
    icon: 'Wrench',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_TECHNICIAN,
      UserRole.COMPANY_MANAGER,
    ],
    element: <MaintenanceList />,
  },
  {
    path: '/maintenances/:id',
    title: 'Détails de la maintenance',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_TECHNICIAN,
      UserRole.COMPANY_MANAGER,
    ],
    element: <MaintenanceDetails />,
  },
  {
    path: '/maintenance/notifications',
    title: 'Notifications',
    icon: 'Bell',
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_TECHNICIAN,
      UserRole.COMPANY_MANAGER,
    ],
    element: <MaintenanceNotifications />,
  },
  {
    path: '/spare-parts',
    title: 'Catalogue Pièces',
    icon: 'Drill',
    allowedRoles: [UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER],
    element: <SpareParts />,
  },
  {
    path: '/spare-parts/stock',
    title: 'Stock & Commandes',
    icon: 'ShoppingCart',
    allowedRoles: [
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_STOCK_MANAGER,
      UserRole.DEALERSHIP_TECHNICIAN
    ],
    element: <DealershipSparePartStock />,
  },
  {
    path: '/spare-parts/orders/validation',
    title: 'Validation Commandes',
    icon: 'CheckSquare',
    allowedRoles: [UserRole.TRIUMPH_ADMIN],
    element: <SparePartOrderValidation />,
  }
];
