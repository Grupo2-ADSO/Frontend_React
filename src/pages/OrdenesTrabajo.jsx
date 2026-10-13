import { useEffect, useState } from 'react';
import TablaEstado from '../components/TablaEstado';
import api from '../services/api';

function OrdenesTrabajo() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activa = true;

    async function obtenerOrdenes() {
      try {
        const respuesta = await api.get('/ordenes');
        const contenido = respuesta.data;
        const filas = Array.isArray(contenido)
          ? contenido
          : contenido?.data ?? contenido?.ordenes ?? [];

        if (activa) setOrdenes(Array.isArray(filas) ? filas : []);
      } catch {
        if (activa) setError('No se pudieron cargar las órdenes. Verifica que el servicio del sistema esté disponible.');
      } finally {
        if (activa) setCargando(false);
      }
    }

    obtenerOrdenes();
    return () => { activa = false; };
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h2>Órdenes de trabajo</h2>
        <p>Listado de órdenes cargado desde el servicio de mantenimiento.</p>
      </div>
      {cargando ? <p className="content-card">Cargando órdenes…</p> : null}
      {error ? <p className="error-message" role="alert">{error}</p> : null}
      {!cargando && !error ? <TablaEstado ordenes={ordenes} /> : null}
    </section>
  );
}

export default OrdenesTrabajo;
