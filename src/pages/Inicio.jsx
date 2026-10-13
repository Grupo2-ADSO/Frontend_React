import { Link } from 'react-router-dom';
import { getRole, roleNames } from '../services/auth';

function Inicio() {
  const role = getRole();

  return (
    <section>
      <div className="page-heading">
        <h2>Bienvenido al sistema de mantenimiento</h2>
        <p>Sesión activa: {roleNames[role] ?? 'usuario'}.</p>
      </div>
      <article className="content-card">
        <h3>Órdenes de trabajo</h3>
        <p>Consulta el estado y los datos de las órdenes registradas.</p>
        <Link className="button" to="/ordenes">Ver órdenes</Link>
      </article>
    </section>
  );
}

export default Inicio;
