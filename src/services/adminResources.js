// Datos básicos de cada módulo que puede administrar el administrador.
// El slug se usa en la dirección de la página y endpoint es la ruta de Laravel.
export const adminResources = [
  { slug: 'usuario', title: 'Usuarios', singular: 'usuario', endpoint: '/usuario', collectionKeys: ['usuarios', 'usuario'], idFields: ['IdUsuario', 'idUsuario', 'id_usuario', 'id'] },
  { slug: 'roles', title: 'Roles', singular: 'rol', endpoint: '/roles', collectionKeys: ['roles', 'rol'], idFields: ['IdRol', 'idRol', 'id_rol', 'id'] },
  { slug: 'ordenes', title: 'Órdenes de trabajo', singular: 'orden', endpoint: '/ordenes', collectionKeys: ['ordenes', 'orden'], idFields: ['idOrden', 'IdOrden', 'id_orden', 'id'] },
  { slug: 'reportes', title: 'Reportes', singular: 'reporte', endpoint: '/reportes', collectionKeys: ['reportes', 'reporte'], idFields: ['IdReporte', 'idReporte', 'id_reporte', 'id'] },
  { slug: 'evaluacion', title: 'Evaluaciones', singular: 'evaluacion', endpoint: '/evaluacion', collectionKeys: ['evaluaciones', 'evaluacion'], idFields: ['IdEvaluacion', 'idEvaluacion', 'id_evaluacion', 'id'] },
  { slug: 'ambientes', title: 'Ambientes', singular: 'ambiente', endpoint: '/ambientes', collectionKeys: ['ambientes', 'ambiente'], idFields: ['id_ambiente', 'IdAmbiente', 'idAmbiente', 'id'] },
  { slug: 'habitaciones', title: 'Habitaciones', singular: 'habitacion', endpoint: '/habitaciones', collectionKeys: ['habitaciones', 'habitacion'], idFields: ['No_habitacion', 'no_habitacion', 'idHabitacion', 'id'] },
  { slug: 'evidencias', title: 'Evidencias', singular: 'evidencia', endpoint: '/evidencias', collectionKeys: ['evidencias', 'evidencia'], idFields: ['IdEvidencia', 'idEvidencia', 'id_evidencia', 'id'] },
  { slug: 'historial', title: 'Historial', singular: 'registro', endpoint: '/historial', collectionKeys: ['historial', 'registros', 'registro'], idFields: ['IdHistorial', 'idHistorial', 'id_historial', 'id'] },
];

// Busca la configuración usando el nombre de la ruta, por ejemplo "habitaciones".
export const adminResourceBySlug = {};
adminResources.forEach((resource) => {
  adminResourceBySlug[resource.slug] = resource;
});

// Laravel puede responder con una lista directa o con una lista dentro de una propiedad.
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

  // Si llega un solo registro en vez de una lista, se convierte en una lista de un elemento.
  if (datos && typeof datos === 'object' && !('message' in datos)) {
    return [datos];
  }

  return [];
}

// Encuentra el identificador porque cada tabla puede llamarlo de manera diferente.
export function getResourceId(registro, recurso) {
  for (const campo of recurso.idFields) {
    if (registro?.[campo] !== undefined && registro[campo] !== null && registro[campo] !== '') {
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
