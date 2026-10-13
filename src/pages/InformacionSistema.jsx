import { useEffect, useState } from 'react';
import api from '../services/api';

// Esta pantalla consulta dos datos que entrega el backend.
function InformacionSistema() {
  const [informacion, setInformacion] = useState(null);
  const [hora, setHora] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function consultarInformacion() {
      try {
        const respuestaInfo = await api.get('/informacion-por-rol');
        setInformacion(respuestaInfo.data);

        const respuestaHora = await api.get('/hora');
        setHora(respuestaHora.data);
      } catch (errorConsulta) {
        setError(
          errorConsulta.response?.data?.message ||
          'No se pudo consultar la información del sistema. Revisa el backend.'
        );
      } finally {
        setCargando(false);
      }
    }

    consultarInformacion();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h2>Información del sistema</h2>
        <p>Datos generales que se consultan desde la API.</p>
      </div>

      {cargando && <p className="content-card">Consultando información...</p>}
      {error && <p className="error-message">{error}</p>}

      {!cargando && !error && (
        <div className="dashboard-grid">
          <article className="content-card">
            <h3>Información según el rol</h3>
            <pre className="datos-sistema">{JSON.stringify(informacion, null, 2)}</pre>
          </article>
          <article className="content-card">
            <h3>Hora del servidor</h3>
            <pre className="datos-sistema">{JSON.stringify(hora, null, 2)}</pre>
          </article>
        </div>
      )}
    </section>
  );
}

export default InformacionSistema;
