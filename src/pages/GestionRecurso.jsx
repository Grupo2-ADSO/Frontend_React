import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ResourceTable from '../components/ResourceTable';
import api from '../services/api';
import {
    adminResourceBySlug,
    normalizeResourceList
} from '../services/adminResources';

function GestionRecurso() {
    const { recurso: slug } = useParams();
    const recurso = adminResourceBySlug[slug];

    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [actualizar, setActualizar] = useState(0);

    useEffect(() => {
        if (!recurso) {
            setCargando(false);
            return;
        }

        async function cargarRegistros() {
            setCargando(true);
            setError('');

            try {
                const respuesta = await api.get(recurso.endpoint);
                setRegistros(normalizeResourceList(respuesta.data, recurso));
            } catch (errorConsulta) {
                setError(
                    errorConsulta.response?.data?.message ||
                    'No se pudieron consultar los registros.'
                );
            } finally {
                setCargando(false);
            }
        }

        cargarRegistros();
    }, [recurso, actualizar]);

    if (!recurso) {
        return (
            <section>
                <h2>Módulo no encontrado</h2>
                <Link to="/admin">Volver al panel</Link>
            </section>
        );
    }

    return (
        <section>
            <div className="page-heading">
                <p><Link to="/admin">Panel de administración</Link></p>
                <h2>{recurso.title}</h2>
            </div>

            {error && <p role="alert">{error}</p>}

            <button
                type="button"
                onClick={() => setActualizar((valor) => valor + 1)}
                disabled={cargando}
            >
                {cargando ? 'Cargando...' : 'Actualizar lista'}
            </button>

            {cargando && <p>Cargando registros...</p>}

            {!cargando && !error && registros.length === 0 && (
                <p>No hay registros para mostrar.</p>
            )}

            {!cargando && !error && registros.length > 0 && (
                <ResourceTable records={registros} resource={recurso} />
            )}
        </section>
    );
}

export default GestionRecurso;