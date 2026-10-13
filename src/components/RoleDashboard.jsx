import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

function RoleDashboard({ title, description, actions }) {
  const user = getCurrentUser();
  const name = user?.Nombre ?? user?.nombre ?? user?.name ?? user?.Correo ?? user?.correo;

  return (
    <section>
      <div className="page-heading">
        <h2>{title}</h2>
        <p>{name ? 'Bienvenido, ' + name + '. ' : 'Bienvenido. '}{description}</p>
      </div>
      <div className="dashboard-grid">
        {actions.map((action) => (
          <article className="dashboard-card" key={action.to}>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
            <Link className="button" to={action.to}>{action.label ?? 'Abrir módulo'}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RoleDashboard;
