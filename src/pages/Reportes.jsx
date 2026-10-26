import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";

const formularioVacio = {
  Tipo: "Mantenimiento",
  fecha_registro: "",
  habitaciones_No_habitacion: "",
  ambientes_id_ambiente: "",
  usuario_IdUsuario: "",
};

function leerCampo(registro, ...campos) {
  for (const campo of campos) {
    if (
      registro?.[campo] !== undefined &&
      registro[campo] !== null &&
      registro[campo] !== ""
    ) {
      return registro[campo];
    }
  }
  return "";
}

function obtenerLista(datos, claves = []) {
  if (Array.isArray(datos)) return datos;
  if (!datos || typeof datos !== "object") return [];
  const posiblesListas = [
    datos.data,
    datos.datos,
    datos.results,
    datos.reportes,
  ];
  for (const lista of posiblesListas) {
    if (Array.isArray(lista)) return lista;
    if (lista && typeof lista === "object") {
      const resultado = obtenerLista(lista, claves);
      if (resultado.length > 0) return resultado;
    }
  }
  return [];
}

function formatearFecha(fechaBD) {
  if (!fechaBD) return "";
  return fechaBD.length >= 16
    ? fechaBD.substring(0, 16).replace(" ", "T")
    : fechaBD;
}

function Reportes() {
  const rol = Number(localStorage.getItem("rol"));


  let enlaces = [];
  if (rol === 1 || rol === 2) {
    enlaces = [
      { texto: "Inicio", ruta: "/admin" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Usuarios", ruta: "/admin/usuario" },
      { texto: "Reportes", ruta: "/admin/reportes" },
      { texto: "Historial", ruta: "/historial" },
    ];
  }

  const [reportes, setReportes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reporteEnEdicion, setReporteEnEdicion] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [actualizarLista, setActualizarLista] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const res = await Promise.allSettled([
        api.get("/reportes"),
        api.get("/habitaciones"),
        api.get("/ambientes"),
        api.get("/usuario"),
      ]);

      if (res[0].status === "fulfilled")
        setReportes(obtenerLista(res[0].value.data));
      if (res[1].status === "fulfilled")
        setHabitaciones(obtenerLista(res[1].value.data));
      if (res[2].status === "fulfilled")
        setAmbientes(obtenerLista(res[2].value.data));
      if (res[3].status === "fulfilled")
        setUsuarios(obtenerLista(res[3].value.data));

      setCargando(false);
    }
    cargarDatos();
  }, [actualizarLista]);

  function cambiarCampo(e) {
    const { name, value } = e.target;
    setFormulario((prev) => {
      const nuevo = { ...prev, [name]: value };
      if (name === "habitaciones_No_habitacion" && value !== "")
        nuevo.ambientes_id_ambiente = "";
      if (name === "ambientes_id_ambiente" && value !== "")
        nuevo.habitaciones_No_habitacion = "";
      return nuevo;
    });
  }

  async function guardarReporte(e) {
    e.preventDefault();
    const fechaParaLaravel = formulario.fecha_registro
      ? formulario.fecha_registro.replace("T", " ")
      : null;
    const datosGuardar = {
      Tipo: formulario.Tipo,
      fecha_registro: fechaParaLaravel,
      habitaciones_No_habitacion: formulario.habitaciones_No_habitacion
        ? Number(formulario.habitaciones_No_habitacion)
        : null,
      ambientes_id_ambiente: formulario.ambientes_id_ambiente
        ? Number(formulario.ambientes_id_ambiente)
        : null,
      usuario_IdUsuario:
        Number(formulario.usuario_IdUsuario) ||
        Number(localStorage.getItem("id")),
    };

    try {
      if (reporteEnEdicion) {
        await api.put(`/reportes/${reporteEnEdicion}`, datosGuardar);
      } else {
        await api.post("/reportes", datosGuardar);
      }
      setMostrarFormulario(false);
      setActualizarLista((v) => v + 1);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al guardar el reporte.");
    }
  }

  return (
    <LayoutPerfil titulo="Gestión de Reportes" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-success">Reportes Registrados</h3>
          <button
            className="btn btn-success"
            onClick={() => {
              setFormulario(formularioVacio);
              setReporteEnEdicion(null);
              setMostrarFormulario(true);
            }}
          >
            Crear reporte
          </button>
        </div>

        {mostrarFormulario && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                {reporteEnEdicion ? "Editar Reporte" : "Nuevo Reporte"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={guardarReporte} className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Tipo de Reporte</label>
                  <select
                    name="Tipo"
                    className="form-select"
                    value={formulario.Tipo}
                    onChange={cambiarCampo}
                    required
                  >
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Daño">Daño</option>
                    <option value="Revisión">Revisión</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Fecha y Hora de Registro</label>
                  <input
                    type="datetime-local"
                    name="fecha_registro"
                    className="form-control"
                    value={formulario.fecha_registro}
                    onChange={cambiarCampo}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Usuario que reporta</label>
                  <select
                    name="usuario_IdUsuario"
                    className="form-select"
                    value={formulario.usuario_IdUsuario}
                    onChange={cambiarCampo}
                    required
                  >
                    <option value="">Selecciona un usuario...</option>
                    {usuarios.map((u) => {
                      const id = leerCampo(
                        u,
                        "IdUsuario",
                        "idUsuario",
                        "id_usuario",
                        "id",
                      );
                      const nombre = leerCampo(u, "Nombre", "nombre", "name");
                      const apellidos = leerCampo(u, "Apellidos", "apellidos");
                      return (
                        <option key={id} value={id}>
                          {nombre} {apellidos}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Habitación</label>
                  <select
                    name="habitaciones_No_habitacion"
                    className="form-select"
                    value={formulario.habitaciones_No_habitacion}
                    onChange={cambiarCampo}
                    required={!formulario.ambientes_id_ambiente}
                  >
                    <option value="">Ninguna</option>
                    {habitaciones.map((h) => {
                      const idHab = leerCampo(
                        h,
                        "No_habitacion",
                        "no_habitacion",
                        "numero_habitacion",
                        "id",
                      );
                      return (
                        <option key={idHab} value={idHab}>
                          Habitación {idHab}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Ambiente</label>
                  <select
                    name="ambientes_id_ambiente"
                    className="form-select"
                    value={formulario.ambientes_id_ambiente}
                    onChange={cambiarCampo}
                    required={!formulario.habitaciones_No_habitacion}
                  >
                    <option value="">Ninguno</option>
                    {ambientes.map((a) => {
                      const idAmb = leerCampo(a, "id_ambi", "IdAmbiente", "id");
                      const nombreAmb = leerCampo(
                        a,
                        "nombre_ambiente",
                        "NombreAmbiente",
                        "nombre",
                        "Nombre",
                      );
                      return (
                        <option key={idAmb} value={idAmb}>
                          {nombreAmb || `Ambiente ${idAmb}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-12 mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {cargando ? (
              <p>Cargando reportes...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Fecha</th>
                      <th>Ubicación</th>
                      <th>ID Usuario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No hay reportes registrados.
                        </td>
                      </tr>
                    ) : (
                      reportes.map((r) => {
                        const idReporte = leerCampo(
                          r,
                          "IdReporte",
                          "idReporte",
                          "id",
                        );
                        const fecha = leerCampo(
                          r,
                          "fecha_registro",
                          "fechaRegistro",
                        );
                        const idHab = leerCampo(
                          r,
                          "habitaciones_No_habitacion",
                          "no_habitacion",
                        );
                        const idAmb = leerCampo(
                          r,
                          "ambientes_id_ambiente",
                          "id_ambiente",
                        );
                        const idUsu = leerCampo(
                          r,
                          "usuario_IdUsuario",
                          "idUsuario",
                        );

                        // Lógica reforzada para nombre del ambiente
                        let textoUbicacion = "—";
                        if (idHab) {
                          textoUbicacion = `Habitación ${idHab}`;
                        } else if (idAmb) {
                          const ambienteEncontrado = ambientes.find(
                            (a) =>
                              String(
                                leerCampo(a, "id_ambi", "IdAmbiente", "id"),
                              ) === String(idAmb),
                          );
                          if (ambienteEncontrado) {
                            textoUbicacion =
                              leerCampo(
                                ambienteEncontrado,
                                "nombre_ambiente",
                                "NombreAmbiente",
                                "nombre",
                                "Nombre",
                              ) || `Ambiente ${idAmb}`;
                          } else {
                            textoUbicacion = `Ambiente ${idAmb}`;
                          }
                        }

                        return (
                          <tr key={idReporte}>
                            <td>{idReporte}</td>
                            <td>{leerCampo(r, "Tipo", "tipo")}</td>
                            <td>{fecha || "—"}</td>
                            <td>{textoUbicacion}</td>
                            <td>{idUsu || "—"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => {
                                  setReporteEnEdicion(idReporte);
                                  setFormulario({
                                    Tipo: leerCampo(r, "Tipo", "tipo"),
                                    fecha_registro: formatearFecha(fecha),
                                    habitaciones_No_habitacion: idHab || "",
                                    ambientes_id_ambiente: idAmb || "",
                                    usuario_IdUsuario: idUsu || "",
                                  });
                                  setMostrarFormulario(true);
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      "¿Estás seguro de eliminar este reporte?",
                                    )
                                  ) {
                                    try {
                                      await api.delete(
                                        `/reportes/${idReporte}`,
                                      );
                                      setActualizarLista((v) => v + 1);
                                    } catch (e) {
                                      alert("No se pudo eliminar el reporte.");
                                    }
                                  }
                                }}
                              >
                                Eliminar
                              </button>
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

export default Reportes;
