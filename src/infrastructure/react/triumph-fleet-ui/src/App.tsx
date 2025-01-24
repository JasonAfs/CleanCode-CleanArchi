// src/infrastructure/react/triumph-fleet-ui/src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Fleet } from './pages/Fleet';
import { User } from './pages/User';
import { Dealership } from './pages/Dealership';
import { Company } from './pages/Company';
import { UserRole } from '@domain/enums/UserRole';
import { useAuth } from './hooks/useAuth';

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

// Configuration des routes protégées
const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    allowedRoles: Object.values(UserRole) // Accessible à tous les rôles
  },
  {
    path: "/fleet",
    element: <Fleet />,
    allowedRoles: [
      UserRole.TRIUMPH_ADMIN,
      UserRole.DEALERSHIP_MANAGER,
      UserRole.COMPANY_MANAGER
    ]
  },
  {
    path: "/user",
    element: <User />,
    allowedRoles: [UserRole.TRIUMPH_ADMIN]
  },
  {
    path: "/dealership",
    element: <Dealership />,
    allowedRoles: [UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER]
  },
  {
    path: "/company",
    element: <Company />,
    allowedRoles: [UserRole.TRIUMPH_ADMIN, UserRole.DEALERSHIP_MANAGER]
  }
];

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

      {/* Routes protégées */}
      {protectedRoutes.map(({ path, element, allowedRoles }) => (
        <Route
          key={path}
          path={path}
          element={
            <RoleBasedRoute allowedRoles={allowedRoles}>
              <DashboardLayout>
                {element}
              </DashboardLayout>
            </RoleBasedRoute>
          }
        />
      ))}

      {/* Redirections par défaut */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};