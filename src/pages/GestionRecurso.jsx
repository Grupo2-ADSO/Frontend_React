import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ResourceTable from '../components/ResourceTable';
import api from '../services/api';
import { adminResourceBySlug, normalizeResourceList } from '../services/adminResources';

function GestionRecurso() {
  const { recurso: slug } = useParams();
  const recurso = adminResourceBySlug[slug];

  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizar, setActualizar] = useState(0);

  useEffect(() => {
    async function cargarRegistros() {
      setCargando(true);
      setError('');

      try {
        const respuesta = await api.get(recurso.endpoint);
        setRegistros(normalizeResourceList(respuesta.data, recurso));
      } catch (errorConsulta) {
        setError(
          errorConsulta.response?.data?.message ||
          'No se pudieron consultar los registros. Revisa la conexión con Laravel.'
        );
      } finally {
        setCargando(false);
      }
    }

    if (recurso) {
      cargarRegistros();
    }
  }, [recurso, actualizar]);

  if (!recurso) {
    return (
      <section className="content-card">
        <h2>Módulo no encontrado</h2>
        <Link className="button" to="/admin">Volver al panel</Link>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <p><Link to="/admin">Panel de administración</Link></p>
        <h2>{recurso.title}</h2>
        <p>En esta etapa se pueden consultar los registros guardados en el sistema.</p>
      </div>

      <article className="content-card">
        <h3>Avance de este módulo</h3>
        <p>La consulta de datos está disponible. Los formularios para crear, editar y eliminar registros quedan pendientes para la siguiente etapa.</p>
      </article>

      {error && <p className="error-message" role="alert">{error}</p>}

      <div className="resource-list-heading">
        <h3>Registros</h3>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setActualizar((valor) => valor + 1)}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Actualizar lista'}
        </button>
      </div>

      {cargando && <p className="content-card">Cargando registros...</p>}
      {!cargando && !error && registros.length === 0 && (
        <p className="content-card">No hay registros para mostrar.</p>
      )}
      {!cargando && registros.length > 0 && (
        <ResourceTable records={registros} resource={recurso} />
      )}
    </section>
  );
}

export default GestionRecurso;
