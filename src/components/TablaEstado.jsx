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
          <tr key={orden.id}>
            <td>{orden.id}</td>
            <td>{orden.habitaciones}</td>
            <td>{orden.descripcion}</td>
            <td>{orden.fecha}</td>
            <td>{orden.estado}</td>
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
