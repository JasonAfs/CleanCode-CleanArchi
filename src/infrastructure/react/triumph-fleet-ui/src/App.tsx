import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { useAuth } from './hooks/useAuth';
import { appRoutes } from '@/navigation/routes';
import { UserRole } from '@domain/enums/UserRole';
import { CompanyDetails } from '@/components/company/CompanyDetails';
import { CompanyEmployees } from '@/components/company/CompanyEmployees';
import { CompanyMotorcycles } from '@/components/company/CompanyMotorcycles';
import { Company } from '@/pages/Company';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterForm />}
      />

      {/* Routes protégées via la configuration unifiée */}
      {appRoutes.map(({ path, element, allowedRoles }) => (
        <Route
          key={path}
          path={path}
          element={
            <RoleBasedRoute allowedRoles={allowedRoles}>
              <DashboardLayout>{element}</DashboardLayout>
            </RoleBasedRoute>
          }
        />
      ))}

      {/* Redirections par défaut */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

      {/* Nouvelles routes */}
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="/companies/:id/employees" element={<CompanyEmployees />} />
      <Route
        path="/companies/:id/motorcycles"
        element={<CompanyMotorcycles />}
      />
      <Route path="/companies" element={<Company />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};
