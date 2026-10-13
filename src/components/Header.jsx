import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, getRole, roleNames } from '../services/auth';

const titles = {
  '/inicio': 'Inicio', '/admin': 'Administrador', '/supervisor': 'Supervisor', '/operario': 'Operario',
  '/ordenes': 'Órdenes de trabajo', '/evidencias': 'Evidencias', '/historial': 'Historial del operario',
  '/perfil': 'Mi perfil', '/cerrar-sesion': 'Cerrar sesión',
};

function Header() {
  const { pathname } = useLocation();
  const user = getCurrentUser();
  const role = getRole();
  const userName = user?.Nombre ?? user?.nombre ?? user?.name ?? user?.Correo ?? user?.correo ?? 'Usuario';

  return (
    <header className="app-header">
      <h1>{titles[pathname] ?? roleNames[role] ?? 'Gestión de mantenimiento'}</h1>
      <div className="app-header-actions">
        <span className="app-user-name">{userName}</span>
        <Link className="profile-link" to="/perfil">Perfil</Link>
      </div>
    </header>
  );
}

export default Header;
