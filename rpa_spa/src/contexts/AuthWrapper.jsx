import { useAuth } from './AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/common/Loader';

export const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) { return (<Loader />); }

  if (!isAuthenticated) {
    return <Navigate to="/api/auth/login" replace />;
  }
  return <Outlet />;
};