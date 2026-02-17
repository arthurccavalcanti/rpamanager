import { useAuth } from './AuthContext';
import { Loader } from '../components/common/Loader';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminWrapper = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) { return (<Loader />); }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/api/auth/login" replace />;
  }
  return <Outlet />;
}