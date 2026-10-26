import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";

function leerCampo(registro, ...campos) {
  for (const campo of campos) {
    if (registro?.[campo] !== undefined && registro[campo] !== null && registro[campo] !== "") {
      return registro[campo];
    }
  }
  return "";
}

function obtenerLista(datos, claves = []) {
  if (Array.isArray(datos)) return datos;
  if (!datos || typeof datos !== "object") return [];
  const posiblesListas = [datos.data, datos.datos, datos.results, datos.historial, datos.usuarios, datos.usuario];
  for (const lista of posiblesListas) {
    if (Array.isArray(lista)) return lista;
    if (lista && typeof lista === "object") {
      const resultado = obtenerLista(lista, claves);
      if (resultado.length > 0) return resultado;
    }
  }
  return [];
}

function idOperario(operario) {
  return leerCampo(operario, "IdUsuario", "idUsuario", "id_usuario", "id");
}

function Historial() {
  const rol = Number(localStorage.getItem("rol"));
  
  const enlacesPorRol = {
    1: [
      { texto: "Inicio", ruta: "/admin" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Usuarios", ruta: "/admin/usuario" },
      { texto: "Reportes", ruta: "/admin/reportes" },
      { texto: "Historial", ruta: "/historial" },
    ],
    2: [
      { texto: "Inicio", ruta: "/supervisor" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
      { texto: "Historial", ruta: "/historial" },
    ],
    3: [
      { texto: "Inicio", ruta: "/operario" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
      { texto: "Historial", ruta: "/historial" },
    ],
  };

  const enlaces = enlacesPorRol[rol] || [];

  const [historiales, setHistoriales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        const resultados = await Promise.allSettled([
          api.get("/historial"),
          api.get("/usuario") 
        ]);
        if (resultados[0].status === "fulfilled") {
          setHistoriales(obtenerLista(resultados[0].value.data));
        }
        if (resultados[1].status === "fulfilled") {
          setUsuarios(obtenerLista(resultados[1].value.data));
        }
      } catch (error) {
        console.error("Error al cargar los datos del historial");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  function nombreOperario(id) {
    if (!id) return "—";
    const operario = usuarios.find((item) => String(idOperario(item)) === String(id));
    if (!operario) return id; 
    const nombre = leerCampo(operario, "Nombre", "nombre", "name");
    const apellidos = leerCampo(operario, "Apellidos", "apellidos");
    return apellidos ? `${nombre} ${apellidos}` : nombre;
  }

  return (
    <LayoutPerfil titulo="Historial de Acciones" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <h3 className="text-success mb-3">Registro de Historial</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            {cargando ? (
              <p>Cargando datos...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Observaciones</th>
                      <th>Fecha</th>
                      <th>ID Orden</th>
                      <th>Operario</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historiales.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No hay registros en el historial.</td>
                      </tr>
                    ) : (
                      historiales.map((h, i) => {
                        const idUsu = leerCampo(h, "usuario_IdUsuario", "id_usuario");
                        return (
                          <tr key={h.idhistorial || i}>
                            <td>{h.idhistorial || "—"}</td>
                            <td>{h.observaciones || "—"}</td>
                            <td>{h.fecha || "—"}</td>
                            <td>{h.id_orden ? `Orden ${h.id_orden}` : "—"}</td>
                            <td>{nombreOperario(idUsu)}</td>
                            <td>
                              <span className="badge bg-success">
                                {h.estado || "—"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutPerfil>
  );
}

export default Historial;