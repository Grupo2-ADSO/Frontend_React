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
  const posiblesListas = [datos.data, datos.datos, datos.results, datos.evidencias, datos.ordenes];
  for (const lista of posiblesListas) {
    if (Array.isArray(lista)) return lista;
    if (lista && typeof lista === "object") {
      const resultado = obtenerLista(lista, claves);
      if (resultado.length > 0) return resultado;
    }
  }
  return [];
}

function Evidencias() {
  const rol = Number(localStorage.getItem("rol"));
  const idUsuarioActual = Number(localStorage.getItem("id"));

  const enlaces = rol === 3 ? [
    { texto: "Inicio", ruta: "/operario" },
    { texto: "Órdenes Asignadas", ruta: "/ordenes" },
    { texto: "Mis Evidencias", ruta: "/evidencias" },
    { texto: "Historial", ruta: "/historial" },
  ] : [];

  const [evidencias, setEvidencias] = useState([]);
  const [ordenesAsignadas, setOrdenesAsignadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({ 
    ordenes_de_trabajo_idOrden: "", 
    tipo: "imagen", 
    observaciones: "" 
  });
  const [archivo, setArchivo] = useState(null);
  const [actualizarLista, setActualizarLista] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        const res = await Promise.allSettled([
          api.get("/evidencia"),
          api.get("/ordenes") 
        ]);

        if (res[0].status === "fulfilled") {
          setEvidencias(obtenerLista(res[0].value.data)); 
        }
        
        if (res[1].status === "fulfilled") {
          const todasLasOrdenes = obtenerLista(res[1].value.data);
          const misOrdenes = todasLasOrdenes.filter(o => 
            Number(leerCampo(o, "usuario_IdUsuario", "id_usuario", "operario_id")) === idUsuarioActual
          );
          setOrdenesAsignadas(misOrdenes);
        }
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [actualizarLista, idUsuarioActual]);

  function cambiarCampo(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarArchivo(e) {
    setArchivo(e.target.files[0]);
  }

  async function guardarEvidencia(e) {
    e.preventDefault();
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const formData = new FormData();
    formData.append("ordenes_de_trabajo_idOrden", formulario.ordenes_de_trabajo_idOrden);
    formData.append("tipo", formulario.tipo);
    formData.append("observaciones", formulario.observaciones);
    formData.append("fecha_envio", fechaActual);
    
    if (archivo) formData.append("archivo", archivo);

    try {
      await api.post("/evidencia", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMostrarFormulario(false);
      setFormulario({ ordenes_de_trabajo_idOrden: "", tipo: "imagen", observaciones: "" });
      setArchivo(null);
      setActualizarLista(v => v + 1);
      alert("Evidencia registrada con éxito");
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al guardar la evidencia.");
    }
  }

  return (
    <LayoutPerfil titulo="Gestión de Evidencias" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-success">Mis Evidencias Registradas</h3>
          <button className="btn btn-success" onClick={() => setMostrarFormulario(true)}>
            Registrar Evidencia
          </button>
        </div>

        {mostrarFormulario && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Nueva Evidencia</h5>
            </div>
            <div className="card-body">
              <form onSubmit={guardarEvidencia} className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label">Orden de Trabajo</label>
                  <select name="ordenes_de_trabajo_idOrden" className="form-select" value={formulario.ordenes_de_trabajo_idOrden} onChange={cambiarCampo} required>
                    <option value="">Selecciona...</option>
                    {ordenesAsignadas.map(o => {
                      const idOrden = leerCampo(o, "id_orden", "IdOrden", "id");
                      const tarea = leerCampo(o, "descripcion", "tarea");
                      return <option key={idOrden} value={idOrden}>Orden #{idOrden} - {tarea}</option>
                    })}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Tipo de Evidencia</label>
                  <select name="tipo" className="form-select" value={formulario.tipo} onChange={cambiarCampo} required>
                    <option value="imagen">Imagen</option>
                    <option value="video">Video</option>
                    <option value="documento">Documento</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Archivo</label>
                  <input type="file" className="form-control" onChange={cambiarArchivo} accept="image/*,video/*,.pdf" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Observaciones</label>
                  <textarea name="observaciones" className="form-control" rows="3" value={formulario.observaciones} onChange={cambiarCampo} required placeholder="Describe qué se reparó o revisó..."></textarea>
                </div>
                <div className="col-12 mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-success">Guardar Evidencia</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {cargando ? <p>Cargando evidencias...</p> : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Orden</th>
                      <th>Observaciones</th>
                      <th>Archivo</th>
                      <th>Fecha de Envío</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidencias.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No has registrado evidencias aún.</td>
                      </tr>
                    ) : (
                      evidencias.map(e => {
                        const idEvidencia = leerCampo(e, "idEvidencia");
                        const tipo = leerCampo(e, "tipo");
                        const idOrden = leerCampo(e, "ordenes_de_trabajo_idOrden");
                        const observaciones = leerCampo(e, "observaciones");
                        const rutaArchivo = leerCampo(e, "ruta_archivo");
                        const fecha = leerCampo(e, "fecha_envio");

                        return (
                          <tr key={idEvidencia}>
                            <td>{idEvidencia}</td>
                            <td><span className="badge bg-secondary">{tipo}</span></td>
                            <td>Orden #{idOrden}</td>
                            <td>{observaciones}</td>
                            <td>
                              {rutaArchivo ? (
                                <a href={`http://127.0.0.1:8000/storage/${rutaArchivo}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info">Ver Archivo</a>
                              ) : "Sin archivo"}
                            </td>
                            <td>{fecha || "—"}</td>
                          </tr>
                        )
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

export default Evidencias;