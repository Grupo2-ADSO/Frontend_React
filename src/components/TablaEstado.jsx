function leerCampo(orden, ...campos) {
    const campo = campos.find(
        (nombre) =>
            orden[nombre] !== undefined &&
            orden[nombre] !== null
    );

    return campo ? orden[campo] : '—';
}


function TablaEstado({ ordenes = [], onEditar }) {

    if (ordenes.length === 0) {
        return (
            <div className="alert alert-info mb-0">
                No hay órdenes de trabajo disponibles.
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Prioridad</th>
                        <th>Fecha de creación</th>
                        <th>Reporte</th>
                        <th>Ambiente</th>
                        <th>Habitación</th>
                        <th>Usuario asignado</th>
                        <th>Estado</th>

                        {onEditar && <th>Acciones</th>}
                    </tr>
                </thead>

                <tbody>
                    {ordenes.map((orden, index) => {
                        const id =
                            orden.idOrden ??
                            orden.IdOrden ??
                            orden.id_orden ??
                            orden.id ??
                            index;

                        return (
                            <tr key={id}>
                                <td>
                                    {leerCampo(
                                        orden,
                                        'idOrden',
                                        'IdOrden',
                                        'id_orden',
                                        'id'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'descripcion',
                                        'Descripcion',
                                        'Descripción'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'prioridad',
                                        'Prioridad'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'fecha_creacion',
                                        'fechaCreacion',
                                        'created_at'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'reportes_IdReporte',
                                        'Reportes_IdReporte',
                                        'reporte_id'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'ambientes_id_ambiente',
                                        'Ambientes_id_ambiente',
                                        'ambiente_id'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'habitaciones_No_habitacion',
                                        'Habitaciones_No_habitacion',
                                        'habitacion'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'usuario_IdUsuario',
                                        'Usuario_IdUsuario',
                                        'usuario_id'
                                    )}
                                </td>

                                <td>
                                    {leerCampo(
                                        orden,
                                        'estado',
                                        'Estado',
                                        'status'
                                    )}
                                </td>

                                {/* Botón para editar la fila seleccionada */}
                                {onEditar && (
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm"
                                            onClick={() => onEditar(orden)}
                                        >
                                            Editar
                                        </button>
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

export default TablaEstado;