import { NavLink } from 'react-router-dom';
import { adminResources } from '../services/adminResources';
import { getRole } from '../services/auth';

const menuByRole = {
  1: [
    { to: '/admin', label: 'Inicio' },
    ...adminResources.map((resource) => ({ to: '/admin/' + resource.slug, label: resource.title })),
    { to: '/admin/informacion', label: 'Información del sistema' },
  ],
  2: [{ to: '/supervisor', label: 'Inicio' }, { to: '/ordenes', label: 'Órdenes de trabajo' }, { to: '/evidencias', label: 'Evidencias' }],
  3: [{ to: '/operario', label: 'Inicio' }, { to: '/ordenes', label: 'Órdenes de trabajo' }, { to: '/evidencias', label: 'Evidencias' }, { to: '/historial', label: 'Historial' }],
};

function Menu() {
  const role = getRole();

  return (
    <aside className="app-sidebar">
      <img src="/img/logo.jpg" alt="Holiday Inn" className="app-logo" />
      <nav className="app-menu" aria-label="Navegación principal">
        {(menuByRole[role] ?? []).map((item) => (
          <NavLink key={item.to} to={item.to} end>{item.label}</NavLink>
        ))}
        <NavLink to="/cerrar-sesion">Cerrar sesión</NavLink>
      </nav>
    </aside>
  );
}

export default Menu;
