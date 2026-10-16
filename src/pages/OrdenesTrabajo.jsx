import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";

const formularioVacio = {
  descripcion: "",
  prioridad: "Media",
  reportes_IdReporte: "",
  habitaciones_No_habitacion: "",
  ambientes_id_ambiente: "",
  estado: "Pendiente",
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
  if (Array.isArray(datos)) {
    return datos;
  }

  if (!datos || typeof datos !== "object") {
    return [];
  }

  for (const clave of claves) {
    if (Array.isArray(datos[clave])) {
      return datos[clave];
    }

    if (Array.isArray(datos.data?.[clave])) {
      return datos.data[clave];
    }

    if (Array.isArray(datos.data?.data?.[clave])) {
      return datos.data.data[clave];
    }
  }

  const posiblesListas = [
    datos.data,
    datos.results,
    datos.habitaciones,
    datos.habitacion,
  ];

  for (const lista of posiblesListas) {
    if (Array.isArray(lista)) {
      return lista;
    }

    if (lista && typeof lista === "object") {
      const resultado = obtenerLista(lista, claves);

      if (resultado.length > 0) {
        return resultado;
      }
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
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Usuarios", ruta: "/admin/usuario" },
      { texto: "Reportes", ruta: "/admin/reportes" },
    ],
    2: [
      { texto: "Inicio", ruta: "/supervisor" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
    ],
    3: [
      { texto: "Inicio", ruta: "/operario" },
      { texto: "Órdenes de trabajo", ruta: "/ordenes" },
      { texto: "Evidencias", ruta: "/evidencias" },
      { texto: "Historial", ruta: "/historial" },
    ],
  };

  const enlaces = enlacesPorRol[rol] || [];

  const [ordenes, setOrdenes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [reportes, setReportes] = useState([]);

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

        const lista = obtenerLista(respuesta.data, ["ordenes", "orden"]);

        if (activo) {
          setOrdenes(lista);
        }
      } catch (errorConsulta) {
        if (activo) {
          setError(
            mensajeError(
              errorConsulta,
              "No se pudieron cargar las órdenes. Verifica que Laravel esté funcionando.",
            ),
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
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
      ]);

      if (!activo) return;

      const errores = [];

      // Habitaciones
      if (resultados[0].status === "fulfilled") {
        const respuestaHabitaciones = resultados[0].value.data;

        // Mostrar en la consola lo que responde Laravel.
        console.log("Respuesta de habitaciones:", respuestaHabitaciones);

        const listaHabitaciones = obtenerLista(respuestaHabitaciones, [
          "habitaciones",
          "habitacion",
        ]);

        console.log("Lista de habitaciones procesada:", listaHabitaciones);

        setHabitaciones(listaHabitaciones);
      } else {
        console.error(
          "Error al consultar habitaciones:",
          resultados[0].reason?.response?.data || resultados[0].reason,
        );

        errores.push("No se pudieron cargar las habitaciones.");
      }


      if (resultados[1].status === "fulfilled") {
        setAmbientes(
          obtenerLista(resultados[1].value.data, ["ambientes", "ambiente"]),
        );
      } else {
        errores.push("No se pudieron cargar los ambientes.");
      }

      if (resultados[2].status === "fulfilled") {
        setReportes(
          obtenerLista(resultados[2].value.data, ["reportes", "reporte"]),
        );
      } else {
        errores.push("No se pudieron cargar los reportes.");
      }

      setErrorOpciones(errores.join(" "));
      setCargandoOpciones(false);
    }

    cargarOpciones();

    return () => {
      activo = false;
    };
  }, []);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
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

      prioridad: leerCampo(orden, "prioridad", "Prioridad") || "Media",

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

      estado: leerCampo(orden, "estado", "status", "Estado") || "Pendiente",
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
      setMensaje("No tienes permisos para crear o editar órdenes.");
      return;
    }

    setGuardando(true);

    const datosOrden = {
      descripcion: formulario.descripcion.trim(),
      prioridad: formulario.prioridad,
      reportes_IdReporte: Number(formulario.reportes_IdReporte),
      habitaciones_No_habitacion: Number(formulario.habitaciones_No_habitacion),
      ambientes_id_ambiente: Number(formulario.ambientes_id_ambiente),
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

      setMensaje(
        mensajeError(
          errorGuardado,
          "No se pudo guardar la orden. Revisa los datos y las validaciones de Laravel.",
        ),
      );
    } finally {
      setGuardando(false);
    }
  }

  function nombreHabitacion(numero) {
    const habitacion = habitaciones.find(
      (item) => String(idHabitacion(item)) === String(numero),
    );

    if (!habitacion) {
      return numero || "—";
    }

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

    if (!ambiente) {
      return id || "—";
    }

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

    if (!reporte) {
      return id || "—";
    }

    const tipo = leerCampo(
      reporte,
      "Tipo",
      "tipo",
      "tipo_reporte",
      "descripcion",
      "Descripcion",
    );

    return tipo ? `Reporte ${id} - ${tipo}` : `Reporte ${id}`;
  }

  return (
    <LayoutPerfil titulo="Órdenes de trabajo" enlaces={enlaces}>
      <div className="container-fluid px-0">
        {/* Encabezado y botones principales */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="text-success mb-1">Órdenes de trabajo</h3>

            <p className="text-secondary mb-0">
              Consulta, crea y edita las órdenes desde este apartado.
            </p>
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

        {/* Mensajes de guardado */}
        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`} role="alert">
            {mensaje}
          </div>
        )}

        {/* Errores de las consultas al backend */}
        {errorOpciones && (
          <div className="alert alert-warning" role="alert">
            {errorOpciones} Verifica que existan las rutas GET
            /api/habitaciones, GET /api/ambientes y GET /api/reportes.
          </div>
        )}

        {/* Formulario para crear y editar */}
        {mostrarFormulario && puedeGestionar && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                {ordenEnEdicion !== null && ordenEnEdicion !== ""
                  ? "Editar orden de trabajo"
                  : "Crear orden de trabajo"}
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={guardarOrden}>
                <div className="row g-3">
                  {/* Descripción */}
                  <div className="col-12">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción del trabajo
                    </label>

                    <textarea
                      id="descripcion"
                      name="descripcion"
                      className="form-control"
                      rows="3"
                      value={formulario.descripcion}
                      onChange={cambiarCampo}
                      required
                      maxLength={1000}
                      placeholder="Describe el mantenimiento que se debe realizar"
                    />
                  </div>

                  {/* Prioridad */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="prioridad" className="form-label">
                      Prioridad
                    </label>

                    <select
                      id="prioridad"
                      name="prioridad"
                      className="form-select"
                      value={formulario.prioridad}
                      onChange={cambiarCampo}
                      required
                    >
                      <option value="Baja">Baja</option>

                      <option value="Media">Media</option>

                      <option value="Alta">Alta</option>
                    </select>
                  </div>

                  {/* Reporte */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="reportes_IdReporte" className="form-label">
                      Reporte relacionado
                    </label>

                    <select
                      id="reportes_IdReporte"
                      name="reportes_IdReporte"
                      className="form-select"
                      value={formulario.reportes_IdReporte}
                      onChange={cambiarCampo}
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">
                        {cargandoOpciones
                          ? "Cargando reportes..."
                          : "Selecciona un reporte"}
                      </option>

                      {reportes.map((reporte, index) => {
                        const id = idReporte(reporte);

                        const tipo = leerCampo(
                          reporte,
                          "Tipo",
                          "tipo",
                          "tipo_reporte",
                          "descripcion",
                          "Descripcion",
                        );

                        return (
                          <option
                            key={id || index}
                            value={id}
                            disabled={id === ""}
                          >
                            {`Reporte ${id}${tipo ? ` - ${tipo}` : ""}`}
                          </option>
                        );
                      })}
                    </select>

                    <small className="text-secondary">
                      Selecciona el reporte que originó la orden.
                    </small>
                  </div>

                  {/* Desplegable de habitaciones */}
                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="habitaciones_No_habitacion"
                      className="form-label"
                    >
                      Habitación
                    </label>

                    <select
                      id="habitaciones_No_habitacion"
                      name="habitaciones_No_habitacion"
                      className="form-select"
                      value={formulario.habitaciones_No_habitacion}
                      onChange={cambiarCampo}
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">
                        {cargandoOpciones
                          ? "Cargando habitaciones..."
                          : "Selecciona una habitación"}
                      </option>

                      {habitaciones.map((habitacion, index) => {
                        const numero = idHabitacion(habitacion);

                        const tipo = leerCampo(
                          habitacion,
                          "tipo_habitacion",
                          "TipoHabitacion",
                          "tipo",
                          "Tipo",
                        );

                        return (
                          <option
                            key={numero || index}
                            value={numero}
                            disabled={numero === ""}
                          >
                            {`Habitación ${numero}${tipo ? ` - ${tipo}` : ""}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Desplegable de ambientes */}
                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="ambientes_id_ambiente"
                      className="form-label"
                    >
                      Ambiente
                    </label>

                    <select
                      id="ambientes_id_ambiente"
                      name="ambientes_id_ambiente"
                      className="form-select"
                      value={formulario.ambientes_id_ambiente}
                      onChange={cambiarCampo}
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">
                        {cargandoOpciones
                          ? "Cargando ambientes..."
                          : "Selecciona un ambiente"}
                      </option>

                      {ambientes.map((ambiente, index) => {
                        const id = idAmbiente(ambiente);

                        const nombre = leerCampo(
                          ambiente,
                          "nombre_ambiente",
                          "NombreAmbiente",
                          "nombre",
                          "Nombre",
                          "descripcion",
                          "Descripcion",
                          "tipo_ambiente",
                          "TipoAmbiente",
                        );

                        return (
                          <option
                            key={id || index}
                            value={id}
                            disabled={id === ""}
                          >
                            {nombre
                              ? `${nombre} (ID: ${id})`
                              : `Ambiente ${id}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Estado */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="estado" className="form-label">
                      Estado
                    </label>

                    <select
                      id="estado"
                      name="estado"
                      className="form-select"
                      value={formulario.estado}
                      onChange={cambiarCampo}
                      disabled={
                        ordenEnEdicion === null || ordenEnEdicion === ""
                      }
                    >
                      <option value="Pendiente">Pendiente</option>

                      <option value="EnProceso">En proceso</option>

                      <option value="Finalizado">Finalizado</option>
                    </select>

                    {ordenEnEdicion === null && (
                      <small className="text-secondary">
                        Las órdenes nuevas se crean en estado Pendiente.
                      </small>
                    )}
                  </div>
                </div>

                {/* Botones del formulario */}
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={guardando || cargandoOpciones}
                  >
                    {guardando
                      ? "Guardando..."
                      : ordenEnEdicion !== null && ordenEnEdicion !== ""
                        ? "Guardar cambios"
                        : "Crear orden"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelarFormulario}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla de órdenes */}
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Órdenes registradas</h5>
          </div>

          <div className="card-body">
            {cargando && (
              <p className="alert alert-info mb-0">Cargando órdenes...</p>
            )}

            {!cargando && error && (
              <p className="alert alert-danger" role="alert">
                {error}
              </p>
            )}

            {!cargando && !error && ordenes.length === 0 && (
              <p className="alert alert-info mb-0">
                No hay órdenes de trabajo registradas.
              </p>
            )}

            {!cargando && !error && ordenes.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Prioridad</th>
                      <th>Fecha de creación</th>
                      <th>Reporte</th>
                      <th>Habitación</th>
                      <th>Ambiente</th>
                      <th>Estado</th>

                      {puedeGestionar && <th>Acciones</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {ordenes.map((orden, index) => {
                      const id = idOrden(orden);

                      const reporteId =
                        leerCampo(orden, "reportes_IdReporte", "reporte_id") ||
                        leerCampo(
                          orden.reporte || orden.Reporte,
                          "IdReporte",
                          "idReporte",
                          "id",
                        );

                      const habitacionId = leerCampo(
                        orden,
                        "habitaciones_No_habitacion",
                        "No_habitacion",
                        "no_habitacion",
                        "habitacion",
                      );

                      const ambienteId = leerCampo(
                        orden,
                        "ambientes_id_ambiente",
                        "ambiente_id",
                        "id_ambiente",
                      );

                      return (
                        <tr key={id || index}>
                          <td>{id || "—"}</td>

                          <td>
                            {leerCampo(
                              orden,
                              "descripcion",
                              "Descripcion",
                              "Descripción",
                            ) || "—"}
                          </td>

                          <td>
                            {leerCampo(orden, "prioridad", "Prioridad") || "—"}
                          </td>

                          <td>
                            {leerCampo(
                              orden,
                              "fecha_creacion",
                              "fechaCreacion",
                              "created_at",
                            ) || "—"}
                          </td>

                          <td>{nombreReporte(reporteId)}</td>

                          <td>{nombreHabitacion(habitacionId)}</td>

                          <td>{nombreAmbiente(ambienteId)}</td>

                          <td>
                            {leerCampo(orden, "estado", "status", "Estado") ||
                              "—"}
                          </td>

                          {puedeGestionar && (
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => abrirFormularioEditar(orden)}
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
            )}
          </div>
        </div>
      </div>
    </LayoutPerfil>
  );
}

export default OrdenesTrabajo;
