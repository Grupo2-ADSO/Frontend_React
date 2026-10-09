function TablaEstado({ ordenes }) {
  return (
    <table className="tabla-ordenes">
      <thead>
        <tr>
          <th>ID</th>
          <th>Habitaciones</th>
          <th>Descripcion</th>
          <th>Fecha</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden.idOrden}>
            <td>{orden.idOrden}</td>
            <td>{orden.descripcion}</td>
            <td>{orden.prioridad}</td>
            <td>{orden.fecha_creacion}</td>
            <td>{orden.reportes_IdReporte}</td>
            <td>{orden.ambientes_id_ambiente}</td>
            <td>{orden.habitaciones_No_habitacion}</td>
            <td>{orden.usuario_IdUsuario}</td>
            <td>
              <span
                className={`estado ${orden.estado.toLowerCase().replace("", "-")}`}
              >
                {orden.estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaEstado;
