import { useEffect, useState } from "react";
import api from "../services/api";

function OrdenesTrabajo() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerOrdenes();
  }, []);

  async function obtenerOrdenes() {
    try {
      const respuesta = await api.get("/ordenes");

      console.log("Respuesta de Laravel", respuesta.data);
      setOrdenes(respuesta.data);
    } catch (error) {
      console.error("Error al obtener las órdenes de trabajo:", error);
      setError("No se pudieron cargar las ordenes");
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return <p>Cargando órdenes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="pagina-ordenes">
      <h2>Órdenes de Trabajo</h2>
      <p>Ordenes obtenidas desde Laravel</p>
      {ordenes.length === 0 ? (
        <p>No hay órdenes de trabajo disponibles.</p>
      ) : (
        <table className="tabla-ordenes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripcion</th>
              <th>Prioridad</th>
              <th>Fecha de creacion</th>
              <th>Reporte</th>
              <th>Ambiente</th>
              <th>Habitacion</th>
              <th>Usuario</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default OrdenesTrabajo;
