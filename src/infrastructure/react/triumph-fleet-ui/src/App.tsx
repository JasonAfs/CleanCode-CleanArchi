import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Home } from './components/Home';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useAuth } from './hooks/useAuth';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginForm />}
            />
            <Route
                path="/register"
                element={user ? <Navigate to="/" replace /> : <RegisterForm />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
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
