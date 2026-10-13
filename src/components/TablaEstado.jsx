function leerCampo(orden, ...campos) {
    const campo = campos.find(
        (nombre) => orden[nombre] !== undefined && orden[nombre] !== null
    );

    return campo ? orden[campo] : '—';
}

function TablaEstado({ ordenes = [] }) {
    if (ordenes.length === 0) {
        return <p className="alert alert-info">No hay órdenes de trabajo disponibles.</p>;
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
                        <th>Usuario</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    {ordenes.map((orden, index) => (
                        <tr key={orden.idOrden ?? orden.id ?? index}>
                            <td>{leerCampo(orden, 'idOrden', 'id')}</td>
                            <td>{leerCampo(orden, 'descripcion', 'Descripción')}</td>
                            <td>{leerCampo(orden, 'prioridad')}</td>
                            <td>{leerCampo(orden, 'fecha_creacion', 'fechaCreacion')}</td>
                            <td>{leerCampo(orden, 'reportes_IdReporte', 'reporte_id')}</td>
                            <td>{leerCampo(orden, 'ambientes_id_ambiente', 'ambiente_id')}</td>
                            <td>{leerCampo(orden, 'habitaciones_No_habitacion', 'habitacion')}</td>
                            <td>{leerCampo(orden, 'usuario_IdUsuario', 'usuario_id')}</td>
                            <td>{leerCampo(orden, 'estado', 'status')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaEstado;