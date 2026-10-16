export const adminResources = [
    { slug: 'usuario', title: 'Usuarios', endpoint: '/usuario', collectionKeys: ['usuarios', 'usuario'], idFields: ['IdUsuario', 'idUsuario', 'id_usuario', 'id'] },
    { slug: 'roles', title: 'Roles', endpoint: '/roles', collectionKeys: ['roles', 'rol'], idFields: ['IdRol', 'idRol', 'id_rol', 'id'] },
    { slug: 'ordenes', title: 'Órdenes de trabajo', endpoint: '/ordenes', collectionKeys: ['ordenes', 'orden'], idFields: ['idOrden', 'IdOrden', 'id_orden', 'id'] },
    { slug: 'reportes', title: 'Reportes', endpoint: '/reportes', collectionKeys: ['reportes', 'reporte'], idFields: ['IdReporte', 'idReporte', 'id_reporte', 'id'] },
    { slug: 'evaluacion', title: 'Evaluaciones', endpoint: '/evaluacion', collectionKeys: ['evaluaciones', 'evaluacion'], idFields: ['IdEvaluacion', 'idEvaluacion', 'id_evaluacion', 'id'] },
    { slug: 'ambientes', title: 'Ambientes', endpoint: '/ambientes', collectionKeys: ['ambientes', 'ambiente'], idFields: ['id_ambiente', 'IdAmbiente', 'idAmbiente', 'id'] },
    { slug: 'habitaciones', title: 'Habitaciones', endpoint: '/habitaciones', collectionKeys: ['habitaciones', 'habitacion'], idFields: ['No_habitacion', 'no_habitacion', 'idHabitacion', 'id'] },
    { slug: 'evidencias', title: 'Evidencias', endpoint: '/evidencias', collectionKeys: ['evidencias', 'evidencia'], idFields: ['IdEvidencia', 'idEvidencia', 'id_evidencia', 'id'] },
    { slug: 'historial', title: 'Historial', endpoint: '/historial', collectionKeys: ['historial', 'registros', 'registro'], idFields: ['IdHistorial', 'idHistorial', 'id_historial', 'id'] },
];

export const adminResourceBySlug = {};

adminResources.forEach((resource) => {
    adminResourceBySlug[resource.slug] = resource;
});

export function normalizeResourceList(datos, recurso) {
    if (Array.isArray(datos)) {
        return datos;
    }

    if (Array.isArray(datos?.data)) return datos.data;
    if (Array.isArray(datos?.results)) return datos.results;

    for (const clave of recurso.collectionKeys) {
        if (Array.isArray(datos?.[clave])) {
            return datos[clave];
        }
    }

    if (datos && typeof datos === 'object' && !('message' in datos)) {
        return [datos];
    }

    return [];
}

export function getResourceId(registro, recurso) {
    for (const campo of recurso.idFields) {
        if (
            registro?.[campo] !== undefined &&
            registro[campo] !== null &&
            registro[campo] !== ''
        ) {
            return registro[campo];
        }
    }

    const campos = Object.keys(registro || {});

    for (const campo of campos) {
        if (/^id(?:_|[a-z]|$)/i.test(campo) || /^no_habitacion$/i.test(campo)) {
            return registro[campo];
        }
    }

    return null;
}