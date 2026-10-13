import { useEffect, useState } from 'react';
import {
    adminResourceBySlug,
    normalizeResourceList
} from '../services/adminResources';
import ResourceTable from './ResourceTable';
import api from '../services/api';

function ResourceList({ slug }) {
    const resource = adminResourceBySlug[slug];

    const [records, setRecords] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [actualizacion, setActualizacion] = useState(0);

    useEffect(() => {
        if (!resource) {
            setCargando(false);
            return;
        }

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

        cargarRegistros();
    }, [resource, actualizacion]);

    if (!resource) {
        return <p role="alert">No se encontró este módulo.</p>;
    }

    return (
        <section>
            {error && <p role="alert">{error}</p>}

            <div>
                <h3>Registros</h3>
                <button
                    type="button"
                    onClick={() => setActualizacion((valor) => valor + 1)}
                    disabled={cargando}
                >
                    {cargando ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            {cargando && <p>Cargando registros...</p>}

            {!cargando && !error && records.length === 0 && (
                <p>No hay registros disponibles.</p>
            )}

            {!cargando && !error && records.length > 0 && (
                <ResourceTable records={records} resource={resource} />
            )}
        </section>
    );
}

export default ResourceList;