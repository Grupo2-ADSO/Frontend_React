import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";

const formularioVacio = {
  descripcion: "",
  prioridad: "media",
  reportes_IdReporte: "",
  habitaciones_No_habitacion: "",
  ambientes_id_ambiente: "",
  usuarios_id_usuario: "",
  estado: "pendiente",
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
  for (const clave of claves) {
    if (Array.isArray(datos[clave])) return datos[clave];
    if (Array.isArray(datos.data?.[clave])) return datos.data[clave];
    if (Array.isArray(datos.data?.data?.[clave])) return datos.data.data[clave];
  }
  const posiblesListas = [
    datos.data,
    datos.datos,
    datos.results,
    datos.habitaciones,
    datos.habitacion,
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

function idHabitacion(habitacion) {
  return leerCampo(
    habitacion,
    "No_habitacion",
    "no_habitacion",
    "numero_habitacion",
    "idHabitacion",
    "id",
  );
}
function idAmbiente(ambiente) {
  return leerCampo(ambiente, "id_ambiente", "IdAmbiente", "idAmbiente", "id");
}
function idReporte(reporte) {
  return leerCampo(reporte, "IdReporte", "idReporte", "id_reporte", "id");
}
function idOrden(orden) {
  return leerCampo(orden, "idOrden", "IdOrden", "id_orden", "id");
}
function idOperario(operario) {
  return leerCampo(operario, "IdUsuario", "idUsuario", "id_usuario", "id");
}

function mensajeError(error, textoPredeterminado) {
  const erroresValidacion = error.response?.data?.errors;
  const primerError = erroresValidacion
    ? Object.values(erroresValidacion).flat()[0]
    : "";
  return (
    primerError ||
    error.response?.data?.mensaje ||
    error.response?.data?.message ||
    textoPredeterminado
  );
}

function OrdenesTrabajo() {
  const rol = Number(localStorage.getItem("rol"));
  const puedeGestionar = rol === 1 || rol === 2;
  const enlacesPorRol = {
    1: [
      { texto: "Inicio", ruta: "/admin" },
      { texto: "Ordenes de trabajo", ruta: "/ordenes" },
      { texto: "Usuarios", ruta: "/admin/usuario" },
      { texto: "Reportes", ruta: "/admin/reportes" },
      { texto: "Historial", ruta: "/historial" },
    ],
    2: [
      { texto: "Inicio", ruta: "/supervisor" },
      { texto: "Ordenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
    ],
    3: [
      { texto: "Inicio", ruta: "/operario" },
      { texto: "Ordenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
      { texto: "Historial", ruta: "/historial" },
    ],
  };
  const enlaces = enlacesPorRol[rol] || [];

  const [ordenes, setOrdenes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [operarios, setOperarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [errorOpciones, setErrorOpciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [actualizarLista, setActualizarLista] = useState(0);

  useEffect(() => {
    let activo = true;
    async function cargarOrdenes() {
      setCargando(true);
      setError("");
      try {
        const respuesta = await api.get("/ordenes");
        let lista = obtenerLista(respuesta.data, ["ordenes", "orden"]);

        const pesosPrioridad = { alta: 1, media: 2, baja: 3 };
        lista.sort((a, b) => {
          const prioA = String(
            leerCampo(a, "prioridad") || "baja",
          ).toLowerCase();
          const prioB = String(
            leerCampo(b, "prioridad") || "baja",
          ).toLowerCase();
          return (pesosPrioridad[prioA] || 3) - (pesosPrioridad[prioB] || 3);
        });

        if (activo) setOrdenes(lista);
      } catch (errorConsulta) {
        if (activo)
          setError(
            mensajeError(
              errorConsulta,
              "No se pudieron cargar las órdenes. Verifica que Laravel esté funcionando.",
            ),
          );
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargarOrdenes();
    return () => {
      activo = false;
    };
  }, [actualizarLista]);

  useEffect(() => {
    let activo = true;
    async function cargarOpciones() {
      setCargandoOpciones(true);
      setErrorOpciones("");
      const resultados = await Promise.allSettled([
        api.get("/habitaciones"),
        api.get("/ambientes"),
        api.get("/reportes"),
        api.get("/usuario"),
      ]);
      if (!activo) return;
      const errores = [];
      if (resultados[0].status === "fulfilled")
        setHabitaciones(
          obtenerLista(resultados[0].value.data, [
            "habitaciones",
            "habitacion",
          ]),
        );
      else errores.push("No se pudieron cargar habitaciones.");
      if (resultados[1].status === "fulfilled")
        setAmbientes(
          obtenerLista(resultados[1].value.data, ["ambientes", "ambiente"]),
        );
      else errores.push("No se pudieron cargar ambientes.");
      if (resultados[2].status === "fulfilled")
        setReportes(
          obtenerLista(resultados[2].value.data, ["reportes", "reporte"]),
        );
      else errores.push("No se pudieron cargar reportes.");

      if (resultados[3]?.status === "fulfilled") {
        const listaUsuarios = obtenerLista(resultados[3].value.data, [
          "usuarios",
          "usuario",
          "datos",
        ]);
        const soloOperarios = listaUsuarios.filter((usuario) => {
          const rolId = String(
            usuario.id_rol || usuario.rol_id || usuario.rol || usuario.Rol,
          );
          const nombreRol = String(
            usuario.rol?.nombre || usuario.rol?.name || "",
          ).toLowerCase();
          return rolId === "3" || nombreRol.includes("operario");
        });
        setOperarios(soloOperarios);
      } else {
        errores.push("No se pudieron cargar operarios.");
      }
      setErrorOpciones(errores.join(" "));
      setCargandoOpciones(false);
    }
    cargarOpciones();
    return () => {
      activo = false;
    };
  }, []);

  async function cambiarEstadoOrden(idOrden, nuevoEstado) {
    if (
      window.confirm(`¿Estás seguro de cambiar esta orden a '${nuevoEstado}'?`)
    ) {
      try {
        await api.patch(`/ordenes/${idOrden}/estado`, { estado: nuevoEstado });
        setTipoMensaje("success");
        setMensaje(`La orden ha pasado a estado: ${nuevoEstado}`);
        setActualizarLista((valor) => valor + 1);
      } catch (error) {
        setTipoMensaje("danger");
        setMensaje(
          mensajeError(error, "No se pudo actualizar el estado de la orden."),
        );
      }
    }
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => {
      const nuevo = { ...anterior, [name]: value };
      if (name === "habitaciones_No_habitacion" && value !== "")
        nuevo.ambientes_id_ambiente = "";
      else if (name === "ambientes_id_ambiente" && value !== "")
        nuevo.habitaciones_No_habitacion = "";
      return nuevo;
    });
  }

  function abrirFormularioNuevo() {
    setOrdenEnEdicion(null);
    setFormulario(formularioVacio);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  }

  function abrirFormularioEditar(orden) {
    setOrdenEnEdicion(idOrden(orden));
    setFormulario({
      descripcion: leerCampo(
        orden,
        "descripcion",
        "Descripcion",
        "Descripción",
      ),
      prioridad: (
        leerCampo(orden, "prioridad", "Prioridad") || "Media"
      ).toLowerCase(),
      reportes_IdReporte: String(
        leerCampo(orden, "reportes_IdReporte", "reporte_id") ||
          leerCampo(
            orden.reporte || orden.Reporte,
            "IdReporte",
            "idReporte",
            "id",
          ) ||
          "",
      ),
      habitaciones_No_habitacion: String(
        leerCampo(
          orden,
          "habitaciones_No_habitacion",
          "No_habitacion",
          "no_habitacion",
        ) ||
          leerCampo(
            orden.habitacion || orden.Habitacion,
            "No_habitacion",
            "no_habitacion",
            "id",
          ) ||
          "",
      ),
      ambientes_id_ambiente: String(
        leerCampo(
          orden,
          "ambientes_id_ambiente",
          "ambiente_id",
          "id_ambiente",
        ) ||
          leerCampo(
            orden.ambiente || orden.Ambiente,
            "id_ambiente",
            "IdAmbiente",
            "id",
          ) ||
          "",
      ),
      usuarios_id_usuario: String(
        leerCampo(
          orden,
          "usuario_IdUsuario",
          "usuarios_id_usuario",
          "usuario_id",
          "operario_id",
        ) ||
          leerCampo(
            orden.usuario || orden.Usuario || orden.operario,
            "IdUsuario",
            "id_usuario",
            "idUsuario",
            "id",
          ) ||
          "",
      ),
      estado: (
        leerCampo(orden, "estado", "status", "Estado") || "pendiente"
      ).toLowerCase(),
    });
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setMostrarFormulario(false);
    setOrdenEnEdicion(null);
    setFormulario(formularioVacio);
    setMensaje("");
  }

  async function guardarOrden(evento) {
    evento.preventDefault();
    setMensaje("");
    if (!puedeGestionar) {
      setTipoMensaje("danger");
      setMensaje("No tienes permisos.");
      return;
    }
    setGuardando(true);
    const datosOrden = {
      descripcion: formulario.descripcion.trim(),
      prioridad: formulario.prioridad,
      reportes_IdReporte: Number(formulario.reportes_IdReporte),
      habitaciones_No_habitacion: formulario.habitaciones_No_habitacion
        ? Number(formulario.habitaciones_No_habitacion)
        : null,
      ambientes_id_ambiente: formulario.ambientes_id_ambiente
        ? Number(formulario.ambientes_id_ambiente)
        : null,
      usuario_IdUsuario: formulario.usuarios_id_usuario
        ? Number(formulario.usuarios_id_usuario)
        : null,
      estado: formulario.estado,
    };
    try {
      if (ordenEnEdicion !== null && ordenEnEdicion !== "") {
        await api.put(`/ordenes/${ordenEnEdicion}`, datosOrden);
        setTipoMensaje("success");
        setMensaje("La orden se actualizó correctamente.");
      } else {
        await api.post("/ordenes", datosOrden);
        setTipoMensaje("success");
        setMensaje("La orden se creó correctamente.");
      }
      setMostrarFormulario(false);
      setOrdenEnEdicion(null);
      setFormulario(formularioVacio);
      setActualizarLista((valor) => valor + 1);
    } catch (errorGuardado) {
      setTipoMensaje("danger");
      setMensaje(mensajeError(errorGuardado, "No se pudo guardar la orden."));
    } finally {
      setGuardando(false);
    }
  }

  function nombreHabitacion(numero) {
    const habitacion = habitaciones.find(
      (item) => String(idHabitacion(item)) === String(numero),
    );
    if (!habitacion) return numero || "—";
    const tipo = leerCampo(
      habitacion,
      "tipo_habitacion",
      "TipoHabitacion",
      "tipo",
      "Tipo",
    );
    return `Habitación ${numero}${tipo ? ` - ${tipo}` : ""}`;
  }

  function nombreAmbiente(id) {
    const ambiente = ambientes.find(
      (item) => String(idAmbiente(item)) === String(id),
    );
    if (!ambiente) return id || "—";
    return (
      leerCampo(
        ambiente,
        "nombre_ambiente",
        "NombreAmbiente",
        "nombre",
        "Nombre",
        "descripcion",
        "Descripcion",
        "tipo_ambiente",
        "TipoAmbiente",
      ) || `Ambiente ${id}`
    );
  }

  function nombreReporte(id) {
    const reporte = reportes.find(
      (item) => String(idReporte(item)) === String(id),
    );
    if (!reporte) return id || "—";
    const tipo = leerCampo(
      reporte,
      "Tipo",
      "tipo",
      "tipo_reporte",
      "descripcion",
      "Descripcion",
    );
    return tipo ? `Reporte ${id}\n${tipo}` : `Reporte ${id}`;
  }

  function nombreOperario(id) {
    const operario = operarios.find(
      (item) => String(idOperario(item)) === String(id),
    );
    if (!operario) return id || "—";
    return (
      leerCampo(operario, "Nombre", "nombre", "nombres", "name") ||
      `Operario ${id}`
    );
  }

  return (
    <LayoutPerfil titulo="Órdenes de trabajo" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="text-success mb-1">Órdenes de trabajo</h3>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => setActualizarLista((valor) => valor + 1)}
              disabled={cargando}
            >
              Actualizar lista
            </button>
            {puedeGestionar && (
              <button
                type="button"
                className="btn btn-success"
                onClick={abrirFormularioNuevo}
              >
                Crear orden
              </button>
            )}
          </div>
        </div>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`} role="alert">
            {mensaje}
          </div>
        )}
        {errorOpciones && (
          <div className="alert alert-warning" role="alert">
            {errorOpciones}
          </div>
        )}

        {mostrarFormulario && puedeGestionar && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                {ordenEnEdicion ? "Editar orden" : "Crear orden"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={guardarOrden}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="descripcion"
                      className="form-control"
                      rows="3"
                      value={formulario.descripcion}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Prioridad</label>
                    <select
                      name="prioridad"
                      className="form-select"
                      value={formulario.prioridad}
                      onChange={cambiarCampo}
                      required
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Reporte relacionado</label>
                    <select
                      name="reportes_IdReporte"
                      className="form-select"
                      value={formulario.reportes_IdReporte}
                      onChange={cambiarCampo}
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">Selecciona un reporte</option>
                      {reportes.map((r) => (
                        <option
                          key={idReporte(r)}
                          value={idReporte(r)}
                        >{`Reporte ${idReporte(r)}`}</option>
                      ))}
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
                      disabled={cargandoOpciones}
                    >
                      <option value="">Selecciona una habitación</option>
                      {habitaciones.map((h) => (
                        <option
                          key={idHabitacion(h)}
                          value={idHabitacion(h)}
                        >{`Habitación ${idHabitacion(h)}`}</option>
                      ))}
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
                      disabled={cargandoOpciones}
                    >
                      <option value="">Selecciona un ambiente</option>
                      {ambientes.map((a) => (
                        <option
                          key={idAmbiente(a)}
                          value={idAmbiente(a)}
                        >{`Ambiente ${idAmbiente(a)}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Operario asignado</label>
                    <select
                      name="usuarios_id_usuario"
                      className="form-select"
                      value={formulario.usuarios_id_usuario}
                      onChange={cambiarCampo}
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">Selecciona un operario</option>
                      {operarios.map((op) => (
                        <option key={idOperario(op)} value={idOperario(op)}>
                          {nombreOperario(idOperario(op))}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={formulario.estado}
                      onChange={cambiarCampo}
                      disabled={!ordenEnEdicion}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en proceso">En proceso</option>
                      <option value="terminado">Terminado</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelarFormulario}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Órdenes registradas</h5>
          </div>
          <div className="card-body">
            {cargando ? (
              <p className="alert alert-info">Cargando...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Prioridad</th>
                      <th>Fecha de creación</th>
                      <th>Reporte</th>
                      <th>Ubicación</th>
                      <th>Operario</th>
                      <th>Estado</th>
                      {(puedeGestionar || rol === 3) && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map((orden) => {
                      const id = idOrden(orden);
                      const reporteId =
                        leerCampo(orden, "reportes_IdReporte", "reporte_id") ||
                        leerCampo(orden.reporte, "IdReporte", "idReporte");
                      const habitacionId = leerCampo(
                        orden,
                        "habitaciones_No_habitacion",
                        "No_habitacion",
                      );
                      const ambienteId = leerCampo(
                        orden,
                        "ambientes_id_ambiente",
                        "ambiente_id",
                      );
                      const operarioId =
                        leerCampo(orden, "usuario_IdUsuario", "operario_id") ||
                        leerCampo(orden.usuario, "IdUsuario");

                      const prioridad = String(
                        leerCampo(orden, "prioridad") || "baja",
                      ).toLowerCase();
                      const estado = String(
                        leerCampo(orden, "estado") || "pendiente",
                      ).toLowerCase();

                      return (
                        <tr key={id}>
                          <td>{id}</td>
                          <td>{leerCampo(orden, "descripcion")}</td>
                          <td>
                            <span
                              className={`badge ${prioridad === "alta" ? "bg-danger" : prioridad === "media" ? "bg-warning text-dark" : "bg-info text-dark"}`}
                            >
                              {prioridad.toUpperCase()}
                            </span>
                          </td>
                          <td>{leerCampo(orden, "fecha_creacion")}</td>
                          <td>{nombreReporte(reporteId)}</td>
                          <td>
                            {habitacionId
                              ? nombreHabitacion(habitacionId)
                              : nombreAmbiente(ambienteId)}
                          </td>
                          <td>{nombreOperario(operarioId)}</td>
                          <td>
                            <span
                              className={`badge ${estado === "pendiente" ? "bg-danger" : estado === "en proceso" ? "bg-warning text-dark" : "bg-success"}`}
                            >
                              {estado.toUpperCase()}
                            </span>
                          </td>
                          {(puedeGestionar || rol === 3) && (
                            <td>
                              <div className="d-flex gap-2">
                                {puedeGestionar && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => abrirFormularioEditar(orden)}
                                  >
                                    Editar
                                  </button>
                                )}
                                {rol === 3 && estado === "pendiente" && (
                                  <button
                                    className="btn btn-sm btn-warning fw-bold text-dark"
                                    onClick={() =>
                                      cambiarEstadoOrden(id, "en proceso")
                                    }
                                  >
                                    Iniciar Trabajo
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
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

export default OrdenesTrabajo;
