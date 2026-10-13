import { useEffect, useState } from 'react';
import api from '../services/api';

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
                    'No se pudo consultar la información del sistema.'
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
                <p>Datos generales consultados desde Laravel.</p>
            </div>

            {cargando && <p>Consultando información...</p>}
            {error && <p role="alert">{error}</p>}

            {!cargando && !error && (
                <>
                    <article className="content-card">
                        <h3>Información según el rol</h3>
                        <pre>{JSON.stringify(informacion, null, 2)}</pre>
                    </article>

                    <article className="content-card">
                        <h3>Hora del servidor</h3>
                        <pre>{JSON.stringify(hora, null, 2)}</pre>
                    </article>
                </>
            )}
        </section>
    );
}

export default InformacionSistema;