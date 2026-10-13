import { getResourceId } from '../services/adminResources';


function nombreColumna(campo) {
  return campo
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function mostrarValor(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return '—';
  }

  if (typeof valor === 'object') {
    return JSON.stringify(valor);
  }

  return String(valor);
}

function ResourceTable({ records = [], resource, onDetail, onEdit, onDelete }) {
  if (records.length === 0) {
    return <p className="content-card">No hay registros para mostrar.</p>;
  }

  const columnas = [];
  records.forEach((registro) => {
    Object.keys(registro || {}).forEach((campo) => {
      if (!columnas.includes(campo)) {
        columnas.push(campo);
      }
    });
  });

  const mostrarAcciones = onDetail || onEdit || onDelete;

  return (
    <div className="table-scroll">
      <table className="data-table" aria-label={resource ? 'Tabla de ' + resource.title : 'Registros'}>
        <thead>
          <tr>
            {columnas.map((campo) => (
              <th key={campo} scope="col">{nombreColumna(campo)}</th>
            ))}
            {mostrarAcciones && <th scope="col">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((registro, indice) => {
            const id = resource
              ? getResourceId(registro, resource)
              : registro.id ?? registro.idOrden ?? registro.idEvidencia ?? indice;

            return (
              <tr key={id ?? indice}>
                {columnas.map((campo) => (
                  <td key={campo}>{mostrarValor(registro?.[campo])}</td>
                ))}
                {mostrarAcciones && (
                  <td>
                    <div className="table-actions">
                      {onDetail && (
                        <button className="table-button" type="button" onClick={() => onDetail(registro)}>
                          Ver
                        </button>
                      )}
                      {onEdit && (
                        <button className="table-button" type="button" onClick={() => onEdit(registro)}>
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button className="table-button table-button-danger" type="button" onClick={() => onDelete(registro)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceTable;
