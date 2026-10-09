import { useState } from 'react'
import izquierda from '../assets/izquierda.jpeg'
import Sergio from '../assets/Sergio.jpeg'


function Administrador({ cerrandoSesion }) {
    const [pagina, setPagina] = useState('inicio')
    const [mostrarModal, setMostrarModal] = useState(false)
    const [tipoCambio, setTipoCambio] = useState('')
    const [contrasenaActual, setContrasenaActual] = useState('')
    const [nuevoCorreo, setNuevoCorreo] = useState('')
    const [nuevaContrasena, setNuevaContrasena] = useState('')
    const [confirmarContrasena, setConfirmarContrasena] = useState('')
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    return (
        <div className="container-fluid p-0">
            <div className='row g-0 min-vh-100'>
                <aside className="col-md-3 col-lg-2 bg-success text-white p-3">
                    <img src={izquierda} className="img-fluid mb-4" alt='Logo' />
                    <nav className="nav flex-column gap-2">
                        <a href="#" className="nav-link text-white" onClick={(e) => e.preventDefault()}>Inicio</a>
                        <a href="#" className="nav-link text-white" onClick={(e) => e.preventDefault()}>Crear Ordenes</a>
                        <a href="#" className="nav-link text-white" onClick={(e) => e.preventDefault()}>Ordenes</a>
                        <a href="#" className="nav-link text-white" onClick={(e) => e.preventDefault()}>Usarios</a>
                        <a href="#" className="nav-link text-white" onClick={(e) => e.preventDefault()}>Reportes</a>
                        <a href="#" className="nav-link text-white" onClick={(e) => {
                            e.preventDefault()
                            cerrandoSesion()
                        }}>
                            Cerrar sesion
                        </a>
                    </nav>
                </aside>
                <main className="col p-4 bg-light">
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
                                                width: '150px',
                                                height: '150px',
                                                objectFit: '150px'
                                            }} />
                                            <h5 className="card-title">
                                                {usuario.Nombre} {usuario.Apellidos}
                                            </h5>
                                            <p className="card-text text-secondary">
                                                Email: {usuario.Correo}
                                            </p>
                                            <button type="button" className="btn btn-success mt-2" onClick={() => {
                                                setMostrarModal(true)
                                                setTipoCambio('')
                                            }}>
                                                Cambiar contraseña o correo
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
                                                <button type='button' className='btn btn-success w-100' onClick={() => setTipoCambio('contrasena')}>
                                                    Cambiar Coneseña
                                                </button>
                                            </>
                                        )}
                                        {tipoCambio === 'correo' && (
                                            <>
                                                <label className='form-label'>
                                                    Contraseña actual
                                                </label>
                                                <input type="password" className='form-control mb-3' value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} placeholder='Ingresa tu contraseña actual' />
                                                <label className='form-label'>
                                                    Nuevo correo
                                                </label>
                                                <input type="email" className='form-control mb-3' value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} placeholder='Ingresa tu nuevo correo' />
                                                <button type='button' className='btn btn-success w-100'>
                                                    Guardar cambios
                                                </button>
                                                <button type='button' className='btn btn-secondary w-100 mt-2' onClick={() => {
                                                    setTipoCambio('')
                                                    setContrasenaActual('')
                                                    setNuevoCorreo('')
                                                }}>
                                                    Volver
                                                </button>
                                            </>
                                        )}
                                        {tipoCambio === 'contrasena' && (
                                            <p></p>
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