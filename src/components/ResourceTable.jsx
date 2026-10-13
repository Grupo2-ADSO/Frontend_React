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

function ResourceTable({ records = [], resource }) {
    if (records.length === 0) {
        return <p>No hay registros para mostrar.</p>;
    }

    const columnas = [];

    records.forEach((registro) => {
        Object.keys(registro || {}).forEach((campo) => {
            if (!columnas.includes(campo)) {
                columnas.push(campo);
            }
        });
    });

    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        {columnas.map((campo) => (
                            <th key={campo} scope="col">
                                {nombreColumna(campo)}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {records.map((registro, indice) => {
                        const id = resource
                            ? getResourceId(registro, resource)
                            : registro.id ?? indice;

                        return (
                            <tr key={id ?? indice}>
                                {columnas.map((campo) => (
                                    <td key={campo}>
                                        {mostrarValor(registro?.[campo])}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ResourceTable;