import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";
import Operario from "./Operario";

function Historial() {
  const rol = Number(localStorage.getItem("rol"));
  // Adaptamos los enlaces según el rol que esté viendo el historial
  const enlaces = rol === 3 ? [
    { texto: "Inicio", ruta: "/operario" },
    { texto: "Órdenes de trabajo", ruta: "/ordenes" },
    { texto: "Evidencias", ruta: "/evidencias" },
    { texto: "Historial", ruta: "/historial" },
  ] : [];

  const [historiales, setHistoriales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const respuesta = await api.get("/historial");
        // Ajusta el extractor según tu backend ("historial", "historiales", "datos")
        setHistoriales(respuesta.data.datos || respuesta.data.historial || respuesta.data);
      } catch (error) {
        console.error("Error al cargar historial");
      } finally {
        setCargando(false);
      }
    }
    cargarHistorial();
  }, []);

  return (
    <LayoutPerfil titulo="Historial de Acciones" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <h3 className="text-success mb-3">Registro de Historial</h3>
        
        <div className="card shadow-sm">
          <div className="card-body">
            {cargando ? <p>Cargando datos...</p> : (
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Descripción / Acción</th>
                    <th>Fecha</th>
                    <th>Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {historiales.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No hay registros en el historial.</td></tr>
                  ) : (
                    historiales.map((h, i) => (
                      <tr key={h.id || i}>
                        <td>{h.id || h.IdHistorial}</td>
                        <td>{h.descripcion || h.accion || "—"}</td>
                        <td>{h.fecha_creacion || h.created_at || "—"}</td>
                        <td>{h.orden_id || h.referencia || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </LayoutPerfil>
  );
}

export default Historial;