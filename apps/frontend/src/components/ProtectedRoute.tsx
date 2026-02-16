import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component that protects routes by requiring authentication
 * If user is not authenticated, they will be redirected to /login
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the useAuth hook will handle redirect to /login
  if (!isAuthenticated) {
    return null; // Return null while redirect is happening
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}