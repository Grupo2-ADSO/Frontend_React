import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('rol');

    if (!token || !role) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}

export default RequireAuth;