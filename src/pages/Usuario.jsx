import { useEffect, useState } from "react";
import LayoutPerfil from "../components/LayoutPerfil";
import api from "../services/api";

const formularioVacio = {
  Nombre: "",
  Apellidos: "",
  Correo: "",
  Contrasena: "",
  Cedula: "",
  Telefono: "",
  Estado: "Activo",
  Rol_IdRol: "",
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
  }
  const posiblesListas = [
    datos.data,
    datos.datos,
    datos.results,
    datos.usuarios,
    datos.usuario,
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

function idUsuario(usuario) {
  return leerCampo(usuario, "IdUsuario", "idUsuario", "id_usuario", "id");
}

function Usuarios() {
  const rol = Number(localStorage.getItem("rol"));
  const puedeGestionar = rol === 1;

  const enlaces = [
    { texto: "Inicio", ruta: "/admin" },
    { texto: "Órdenes de trabajo", ruta: "/ordenes" },
    { texto: "Usuarios", ruta: "/admin/usuario" },
    { texto: "Reportes", ruta: "/admin/reportes" },
    { texto: "Historial", ruta: "/historial" },
  ];

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [actualizarLista, setActualizarLista] = useState(0);

  useEffect(() => {
    let activo = true;
    async function cargarUsuarios() {
      setCargando(true);
      try {
        const respuesta = await api.get("/usuario");
        if (activo)
          setUsuarios(obtenerLista(respuesta.data, ["usuarios", "usuario"]));
      } catch (error) {
        if (activo) {
          setTipoMensaje("danger");
          setMensaje("No se pudieron cargar los usuarios.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargarUsuarios();
    return () => {
      activo = false;
    };
  }, [actualizarLista]);

  function cambiarCampo(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function abrirFormularioNuevo() {
    setUsuarioEnEdicion(null);
    setFormulario(formularioVacio);
    setMensaje("");
    setMostrarFormulario(true);
  }

  function abrirFormularioEditar(user) {
    setUsuarioEnEdicion(idUsuario(user));
    setFormulario({
      Nombre: leerCampo(user, "Nombre", "nombre", "name"),
      Apellidos: leerCampo(user, "Apellidos", "apellidos"),
      Correo: leerCampo(user, "Correo", "correo", "email"),
      Contrasena: "",
      Cedula: leerCampo(user, "Cedula", "cedula"),
      Telefono: leerCampo(user, "Telefono", "telefono"),
      Estado: leerCampo(user, "Estado", "estado", "status") || "Activo",
      Rol_IdRol: String(leerCampo(user, "Rol_IdRol", "rol_id", "id_rol")),
    });
    setMensaje("");
    setMostrarFormulario(true);
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    setMensaje("");
    setGuardando(true);

    const datosGuardar = {
      ...formulario,
      Rol_IdRol: Number(formulario.Rol_IdRol),
    };

    if (usuarioEnEdicion && !datosGuardar.Contrasena) {
      delete datosGuardar.Contrasena;
    }

    try {
      if (usuarioEnEdicion) {
        await api.put(`/usuario/${usuarioEnEdicion}`, datosGuardar);
        setMensaje("Usuario actualizado correctamente.");
      } else {
        await api.post("/usuario", datosGuardar);
        setMensaje("Usuario creado correctamente.");
      }
      setTipoMensaje("success");
      setMostrarFormulario(false);
      setActualizarLista((v) => v + 1);
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(
        error.response?.data?.mensaje || "Error al guardar el usuario.",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarUsuario(id) {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await api.delete(`/usuario/${id}`);
      setMensaje("Usuario eliminado.");
      setTipoMensaje("success");
      setActualizarLista((v) => v + 1);
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje("No se pudo eliminar el usuario.");
    }
  }

  return (
    <LayoutPerfil titulo="Gestión de Usuarios" enlaces={enlaces}>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-success">Usuarios</h3>
          <button className="btn btn-success" onClick={abrirFormularioNuevo}>
            Crear usuario
          </button>
        </div>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`}>{mensaje}</div>
        )}

        {mostrarFormulario && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                {usuarioEnEdicion ? "Editar usuario" : "Crear usuario"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={guardarUsuario}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="Nombre"
                      className="form-control"
                      value={formulario.Nombre}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      name="Apellidos"
                      className="form-control"
                      value={formulario.Apellidos}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="Correo"
                      className="form-control"
                      value={formulario.Correo}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Contraseña{" "}
                      {usuarioEnEdicion && "(Deja vacío para mantener)"}
                    </label>
                    <input
                      type="password"
                      name="Contrasena"
                      className="form-control"
                      value={formulario.Contrasena}
                      onChange={cambiarCampo}
                      required={!usuarioEnEdicion}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cédula</label>
                    <input
                      type="text"
                      name="Cedula"
                      className="form-control"
                      value={formulario.Cedula}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      name="Telefono"
                      className="form-control"
                      value={formulario.Telefono}
                      onChange={cambiarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol</label>
                    <select
                      name="Rol_IdRol"
                      className="form-select"
                      value={formulario.Rol_IdRol}
                      onChange={cambiarCampo}
                      required
                    >
                      <option value="">Seleccione un rol...</option>
                      <option value="1">Administrador</option>
                      <option value="2">Supervisor</option>
                      <option value="3">Operario</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      name="Estado"
                      className="form-select"
                      value={formulario.Estado}
                      onChange={cambiarCampo}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-success me-2"
                    disabled={guardando}
                  >
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
              <p>Cargando...</p>
            ) : (
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Cédula</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => {
                    const id = idUsuario(u);
                    const rolMap = {
                      1: "Admin",
                      2: "Supervisor",
                      3: "Operario",
                    };
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>
                          {u.Nombre} {u.Apellidos}
                        </td>
                        <td>{u.Cedula}</td>
                        <td>{u.Correo}</td>
                        <td>{u.Telefono}</td>
                        <td>{rolMap[u.Rol_IdRol] || u.Rol_IdRol}</td>
                        <td>
                          <span
                            className={`badge ${u.Estado === "Activo" ? "bg-success" : "bg-danger"}`}
                          >
                            {u.Estado}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirFormularioEditar(u)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarUsuario(id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </LayoutPerfil>
  );
}

export default Usuarios;
