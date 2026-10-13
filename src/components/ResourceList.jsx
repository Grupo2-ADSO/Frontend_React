import { useEffect, useState } from 'react';
import { adminResourceBySlug, normalizeResourceList } from '../services/adminResources';
import ResourceTable from './ResourceTable';
import api from '../services/api';

function ResourceList({ slug }) {
  const resource = adminResourceBySlug[slug];
  const [records, setRecords] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizacion, setActualizacion] = useState(0);

  useEffect(() => {
    async function cargarRegistros() {
      setCargando(true);
      setError('');

      try {
        const respuesta = await api.get(resource.endpoint);
        setRecords(normalizeResourceList(respuesta.data, resource));
      } catch (errorConsulta) {
        setError(
          errorConsulta.response?.data?.message ||
          'No se pudieron consultar los registros.'
        );
      } finally {
        setCargando(false);
      }
    }

    if (resource) {
      cargarRegistros();
    }
  }, [resource, actualizacion]);

  if (!resource) {
    return <p className="error-message">No se encontró este módulo.</p>;
  }

  return (
    <section>
      {error && <p className="error-message" role="alert">{error}</p>}

      <div className="resource-list-heading">
        <h3>Registros</h3>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setActualizacion(actualizacion + 1)}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {cargando && <p className="content-card">Cargando registros...</p>}
      {!cargando && !error && records.length === 0 && (
        <p className="content-card">No hay registros disponibles.</p>
      )}
      {!cargando && records.length > 0 && (
        <ResourceTable records={records} resource={resource} />
      )}
    </section>
  );
}

export default ResourceList;
