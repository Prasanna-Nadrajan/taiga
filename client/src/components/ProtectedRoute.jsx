import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="forbidden-page">
        <div className="forbidden-content">
          <h1>403</h1>
          <h2>Access Denied</h2>
          <p>Your role <span className="role-badge">{user.role}</span> does not have access to this page.</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
