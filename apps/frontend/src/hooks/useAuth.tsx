import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication, getMe } from '../services/api';

/**
 * Hook to handle authentication and redirect to login if unauthenticated
 * @param redirectOnAuth - Whether to redirect to login on authentication failure (default: true)
 * @returns Object containing user, loading state, and authentication status
 */
export function useAuth(redirectOnAuth: boolean = true) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication()
        .then((authentificated) => {
            let isAuthenticated = Boolean(authentificated.authenticated);
            setIsAuthenticated(isAuthenticated);
            console.log('Authentication check result:', isAuthenticated);
            if(isAuthenticated) {
                getMe().then((user) => setUser(user));
            } else {
                // Handle unauthenticated case - redirect to login
                console.log('User not authenticated');
                setUser(null);
                setIsAuthenticated(false);
                
                // Only redirect if not already on login page and redirectOnAuth is true
                if (redirectOnAuth && window.location.pathname !== '/login') {
                    navigate('/login');
                }
            }
        })
        .catch((error) => {
            console.log('Authentication check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            
            // Only redirect if not already on login page and redirectOnAuth is true
            if (redirectOnAuth && window.location.pathname !== '/login') {
                navigate('/login');
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate, redirectOnAuth]);

    return {
        user,
        loading,
        isAuthenticated
    };
}