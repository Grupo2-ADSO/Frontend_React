import { useEffect, useState } from 'react';
import TablaEstado from '../components/TablaEstado';
import LayoutPerfil from '../components/LayoutPerfil';
import api from '../services/api';

function OrdenesTrabajo() {
    const rol = Number(localStorage.getItem('rol'));

    const enlacesPorRol = {
        1: [
            { texto: 'Inicio', ruta: '/admin' },
            { texto: 'Crear órdenes', ruta: '/ordenes' },
            { texto: 'Órdenes', ruta: '/admin/ordenes' },
            { texto: 'Usuarios', ruta: '/admin/usuario' },
            { texto: 'Reportes', ruta: '/admin/reportes' },
        ],
        2: [
            { texto: 'Inicio', ruta: '/supervisor' },
            { texto: 'Órdenes de trabajo', ruta: '/ordenes' },
            { texto: 'Evidencias', ruta: '/evidencias' },
        ],
        3: [
            { texto: 'Inicio', ruta: '/operario' },
            { texto: 'Órdenes de trabajo', ruta: '/ordenes' },
            { texto: 'Evidencias', ruta: '/evidencias' },
            { texto: 'Historial', ruta: '/historial' },
        ]
    };

    const enlaces = enlacesPorRol[rol] || [];

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
        <LayoutPerfil titulo="Órdenes de trabajo" enlaces={enlaces}>
            {cargando && <p className='alert alert-info'>Cargando órdenes...</p>}
            {error && <p className='alert alert-danger' role='alert'>{error}</p>}
            {!cargando && !error && (
                <TablaEstado ordenes={ordenes} />
            )}
        </LayoutPerfil>
    );
}

export default OrdenesTrabajo;