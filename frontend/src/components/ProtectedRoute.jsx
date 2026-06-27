import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Common';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader full label="Authenticating..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
