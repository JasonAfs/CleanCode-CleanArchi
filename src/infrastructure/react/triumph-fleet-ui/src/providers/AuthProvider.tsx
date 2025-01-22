import { useState, useEffect, ReactNode, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { HttpAuthenticationGateway } from '../services/auth/HttpAuthenticationGateway';
import type { User } from '@domain/entities/UserEntity';
import type { LoginDTO } from '@application/dtos/auth/LoginDTO';
import type { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
    readonly children: ReactNode;
}

interface JwtPayload {
    userId: string;
    role: string;
    email: string;
    exp: number;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const authGateway = useMemo(() => new HttpAuthenticationGateway(), []);

    // Fonction pour extraire les informations utilisateur du token
    const getUserFromToken = (token: string) => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return {
                id: decoded.userId,
                role: decoded.role,
                email: decoded.email
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // Vérifie l'authentification au chargement
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const userData = getUserFromToken(accessToken);
            if (userData) {
                setUser(userData as User); //todo : à corriger
            }
        }
    }, []);

    const value = useMemo(() => ({
        user,
        login: async (credentials: LoginDTO) => {
            const tokens = await authGateway.login(credentials);
            if (tokens.accessToken) {
                const userData = getUserFromToken(tokens.accessToken);
                if (userData) {
                    setUser(userData as User);
                }
            }
            return tokens;
        },
        register: async (data: RegisterDTO) => {
            return authGateway.register(data);
        },
        logout: async () => {
            await authGateway.logout();
            setUser(null);
        }
    }), [user, authGateway]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}