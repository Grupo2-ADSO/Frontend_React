import { useState } from 'react'
import izquierda from '../assets/izquierda.jpeg'
import Sergio from '../assets/Sergio.jpeg'
import fondo2 from '../assets/fondo2.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Administrador({ cerrandoSesion }) {
    const navigate = useNavigate()

    const cerrarPerfil = cerrandoSesion || (() => navigate('/cerrar-sesion'))
    const [pagina, setPagina] = useState('inicio')
    const [mostrarModal, setMostrarModal] = useState(false)
    const [tipoCambio, setTipoCambio] = useState('')
    const [contrasenaActual, setContrasenaActual] = useState('')
    const [nuevoCorreo, setNuevoCorreo] = useState('')
    const [nuevoTelefono, setNuevoTelefono] = useState('')
    const [nuevaContrasena, setNuevaContrasena] = useState('')
    const [confirmarContrasena, setConfirmarContrasena] = useState('')
    const [usuario, setUsuario] = useState(() =>
        JSON.parse(localStorage.getItem('usuario') || '{}')
    )
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')
    const [guardando, setGuardando] = useState(false)

    const guardarCorreo = async () => {
        setMensaje('')
        if (!contrasenaActual.trim() || !nuevoCorreo.trim()) {
            setTipoMensaje('danger')
            setMensaje('Debes ingresar la contraseña actual y el nuevo correo.')
            return
        }
        setGuardando(true)

        try {
            const respuesta = await api.put('/perfil/correo', {
                Contrasena: contrasenaActual,
                Correo: nuevoCorreo
            })

            const usuarioActualizado = {
                ...usuario,
                Correo: respuesta.data.Correo || nuevoCorreo
            }

            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
            setUsuario(usuarioActualizado)

            setTipoMensaje('success')
            setMensaje(respuesta.data.mensaje || 'Correo actualizado correctamente.')

            setContrasenaActual('')
            setNuevoCorreo('')
        } catch (error) {
            const errores = error.response?.data?.errors

            const mensajeError =
                error.response?.data?.mensaje ||
                error.response?.data?.message ||
                (errores ? Object.values(errores).flat()[0] : null) ||
                'No se pudo actualizar el correo'

            setTipoMensaje('danger')
            setMensaje(mensajeError)
        } finally {
            setGuardando(false)
        }
    }

    const guardarTelefono = async () => {
        setMensaje('')
        if (!contrasenaActual.trim() || !nuevoTelefono.trim()) {
            setTipoMensaje('danger')
            setMensaje('Debes ingresar la contraseña actual y el nuevo Telefono.')
            return
        }
        setGuardando(true)

        try {
            const respuesta = await api.put('/perfil/telefono', {
                Contrasena: contrasenaActual,
                Telefono: nuevoTelefono
            })

            const usuarioActualizado = {
                ...usuario,
                Telefono: respuesta.data.Telefono || nuevoTelefono
            }

            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
            setUsuario(usuarioActualizado)

            setTipoMensaje('success')
            setMensaje(respuesta.data.mensaje || 'Telefono actualizado correctamente.')

            setContrasenaActual('')
            setNuevoTelefono('')
        } catch (error) {
            const errores = error.response?.data?.errors

            const mensajeError =
                error.response?.data?.mensaje ||
                error.response?.data?.message ||
                (errores ? Object.values(errores).flat()[0] : null) ||
                'No se pudo actualizar el telefono'

            setTipoMensaje('danger')
            setMensaje(mensajeError)
        } finally {
            setGuardando(false)
        }
    }

    const guardarContrasena = async () => {
        setMensaje('')
        if (!contrasenaActual.trim() || !nuevaContrasena.trim()) {
            setTipoMensaje('danger')
            setMensaje('Debes ingresar la contraseña actual y el nueva Contraseña.')
            return
        }
        setGuardando(true)

        try {
            const respuesta = await api.put('/perfil/contrasena', {
                Contrasena: contrasenaActual,
                NuevaContrasena: nuevaContrasena
            })


            setTipoMensaje('success')
            setMensaje(respuesta.data.mensaje || 'Contraseña actualizado correctamente.')

            setContrasenaActual('')
            setNuevaContrasena('')
        } catch (error) {
            const errores = error.response?.data?.errors

            const mensajeError =
                error.response?.data?.mensaje ||
                error.response?.data?.message ||
                (errores ? Object.values(errores).flat()[0] : null) ||
                'No se pudo actualizar el contraseña'

            setTipoMensaje('danger')
            setMensaje(mensajeError)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className='row g-0 min-vh-100'>
                <aside className="col-md-3 col-lg-2 bg-success text-white p-0">
                    <img src={izquierda} className="w-100 mb-4" alt='Logo' style={{
                        marginTop: '-12px',
                        display: 'block'
                    }} />
                    <nav className="nav flex-column gap-2">
                        <Link to="/admin" className="nav-link text-white" >Inicio</Link>
                        <Link to="/ordenes" className="nav-link text-white" >Ordenes de trabajo</Link>
                        <Link to="/admin/usuario" className="nav-link text-white" >Usarios</Link>
                        <Link to="/admin/reportes" className="nav-link text-white" >Reportes</Link>
                        <a href="#" className="nav-link text-white" onClick={(e) => {
                            e.preventDefault()
                            cerrarPerfil()
                        }}>
                            Cerrar sesion
                        </a>
                    </nav>
                </aside>
                <main className="col p-4" style={{
                    backgroundImage: `url(${fondo2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
                        <h4 className='mb-0 text-success'>
                            Adminitrador
                        </h4>
                        <a href="#" className="btn btn-outline-success" onClick={(e) => {
                            e.preventDefault()
                            setPagina('perfil')
                        }}>
                            Perfil
                        </a>
                    </div>
                    {pagina === 'perfil' && (
                        <section className="container-fluid py-3">
                            <div className="row justify-content-center">
                                <div className='col-12 col-md-10 col-lg-8'>
                                    <div className='card shadow-sm border-0'>
                                        <div className="card-header bg-success text-white">
                                            <span>
                                                Activo
                                            </span>
                                        </div>
                                        <div className="card-body d-flex flex-column align-items-center text-center p-4">
                                            <img src={Sergio} className="rounded-circle img-thumbnail mb-3" alt='Foto de perfil' style={{
                                                width: '180px',
                                                height: '180px',
                                                objectFit: 'cover'
                                            }} />
                                            <h5 className="card-title">
                                                {usuario.Nombre} {usuario.Apellidos}
                                            </h5>
                                            <div className='text-secondary mb-3' >
                                                <p className="mb-2">
                                                    <strong>Correo:</strong> {usuario.Correo}
                                                </p>
                                                <p className='mb-0'>
                                                    <strong>Telefono:</strong> {usuario.Telefono}
                                                </p>
                                                <p className='mb-2'>
                                                    <strong>Cedula:</strong> {usuario.Cedula}
                                                </p>
                                            </div>
                                            <button type="button" className="btn btn-success mt-2" onClick={() => {
                                                setMostrarModal(true)
                                                setTipoCambio('')
                                            }}>
                                                Cambiar datos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    {mostrarModal && (
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered" style={{ transform: 'translate(100px, 30px)' }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Cambiar datos
                                        </h5>
                                        <button type='button' className='btn-close' onClick={() => setMostrarModal(false)}></button>
                                    </div>
                                    <div className='modal-body'>
                                        {!tipoCambio && (
                                            <>
                                                <p>¿Que deseas cambiar?</p>
                                                <button type='button' className='btn btn-success w-100 mb-2' onClick={() => setTipoCambio('correo')}>
                                                    Cambiar correo
                                                </button>
                                                <button type='button' className='btn btn-success w-100 mb-2' onClick={() => setTipoCambio('telefono')}>
                                                    Cambiar telefono
                                                </button>
                                                <button type='button' className='btn btn-success w-100' onClick={() => setTipoCambio('contrasena')}>
                                                    Cambiar Contraseña
                                                </button>
                                            </>
                                        )}
                                        {tipoCambio === 'correo' && (
                                            <>
                                                {mensaje && (
                                                    <div className={`alert alert-${tipoMensaje}`} role='alert'>
                                                        {mensaje}
                                                    </div>
                                                )}
                                                <label className='form-label'>
                                                    Contraseña actual
                                                </label>
                                                <input type="password" className='form-control mb-3' value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} placeholder='Ingresa tu contraseña actual' />
                                                <label className='form-label'>
                                                    Nuevo correo
                                                </label>
                                                <input type="email" className='form-control mb-3' value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} placeholder='Ingresa tu nuevo correo' />
                                                <button type='button' className='btn btn-success w-100' onClick={guardarCorreo} disabled={guardando}>
                                                    {guardando ? 'Guardando.....' : 'Guardar cambios'}
                                                </button>
                                                <button type='button' className='btn btn-secondary w-100 mt-2' onClick={() => {
                                                    setTipoCambio('')
                                                    setContrasenaActual('')
                                                    setNuevoCorreo('')
                                                    setMensaje('')
                                                    setTipoMensaje('')
                                                }}>
                                                    Volver
                                                </button>
                                            </>
                                        )}
                                        {tipoCambio === 'telefono' && (
                                            <>
                                                {mensaje && (
                                                    <div className={`alert alert-${tipoMensaje}`} role='alert'>
                                                        {mensaje}
                                                    </div>
                                                )}
                                                <label className='form-label'>
                                                    Contraseña actual
                                                </label>
                                                <input type="password" className='form-control mb-3' value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} placeholder='Ingresa tu contraseña actual' />
                                                <label className='form-label'>
                                                    Nuevo telefono
                                                </label>
                                                <input type="tel" className='form-control mb-3' value={nuevoTelefono} onChange={(e) => setNuevoTelefono(e.target.value)} placeholder='Ingresa tu nuevo telefono' />
                                                <button type='button' className='btn btn-success w-100' onClick={guardarTelefono} disabled={guardando}>
                                                    {guardando ? 'Guardando.....' : 'Guardar cambios'}
                                                </button>
                                                <button type='button' className='btn btn-secondary w-100 mt-2' onClick={() => {
                                                    setTipoCambio('')
                                                    setContrasenaActual('')
                                                    setNuevoTelefono('')
                                                    setMensaje('')
                                                    setTipoMensaje('')
                                                }}>
                                                    Volver
                                                </button>
                                            </>
                                        )}
                                        {tipoCambio === 'contrasena' && (
                                            <>
                                                {mensaje && (
                                                    <div className={`alert alert-${tipoMensaje}`} role='alert'>
                                                        {mensaje}
                                                    </div>
                                                )}
                                                <label className='form-label'>
                                                    Contraseña actual
                                                </label>
                                                <input type="password" className='form-control mb-3' value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} placeholder='Ingresa tu contraseña actual' />
                                                <label className='form-label'>
                                                    Nueva Contraseña
                                                </label>
                                                <input type="password" className='form-control mb-3' value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} placeholder='Ingresa tu nueva contraseña' />
                                                <button type='button' className='btn btn-success w-100' onClick={guardarContrasena} disabled={guardando}>
                                                    {guardando ? 'Guardando.....' : 'Guardar cambios'}
                                                </button>
                                                <button type='button' className='btn btn-secondary w-100 mt-2' onClick={() => {
                                                    setTipoCambio('')
                                                    setContrasenaActual('')
                                                    setNuevaContrasena('')
                                                    setMensaje('')
                                                    setTipoMensaje('')
                                                }}>
                                                    Volver
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className='modal-footer'>
                                        <button type='button' className='btn btn-secondary' onClick={() => setMostrarModal(false)}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Administrador