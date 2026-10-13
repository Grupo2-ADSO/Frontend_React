import { useEffect, useState } from 'react';
import TablaEstado from '../components/TablaEstado';
import api from '../services/api';

function OrdenesTrabajo() {
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function obtenerOrdenes() {
            try {
                const respuesta = await api.get('/ordenes');
                const contenido = respuesta.data;
                const filas = Array.isArray(contenido)
                    ? contenido
                    : contenido?.data ?? contenido?.ordenes ?? [];

                setOrdenes(Array.isArray(filas) ? filas : []);
            } catch {
                setError('No se pudieron cargar las órdenes. Verifica que Laravel esté funcionando.');
            } finally {
                setCargando(false);
            }
        }

        obtenerOrdenes();
    }, []);

    return (
        <section>
            <h2>Órdenes de trabajo</h2>

            {cargando && <p>Cargando órdenes...</p>}
            {error && <p role="alert">{error}</p>}
            {!cargando && !error && <TablaEstado ordenes={ordenes} />}
        </section>
    );
}

export default OrdenesTrabajo;