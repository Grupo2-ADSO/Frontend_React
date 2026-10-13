import { Navigate } from 'react-router-dom';
import { getHomePath, getRole } from '../services/auth';

function RequireRole({ roles, children }) {
  const role = getRole();

  if (!roles.includes(role)) {
    return <Navigate to={getHomePath(role)} replace />;
  }

  return children;
}

export default RequireRole;
