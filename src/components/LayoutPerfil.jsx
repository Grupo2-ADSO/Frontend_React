import izquierda from '../assets/izquierda.jpeg';
import fondo2 from '../assets/fondo2.jpeg';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function LayoutPerfil({ titulo, enlaces = [], cerrarSesion, children }) {
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const salir = cerrarSesion || (() => {
        window.location.href = '/cerrar-sesion';
    });
    return (
        <div className='container-fluid p-0'>
            <div className='row g-0 min-vh-100'>
                <aside className='col-md-3 col-lg-2 bg-success text-white p-0'>
                    <img src={izquierda}
                        className="w-100 mb-4"
                        alt="Logo"
                        style={{
                            marginTop: '-12px',
                            display: 'block'
                        }}
                    />
                    <nav className='nav flex-column gap-2'>
                        {enlaces.map((enlace) => (
                            <Link
                                key={enlace.ruta}
                                to={enlace.ruta}
                                className="nav-link text-white"
                            >
                                {enlace.texto}
                            </Link>
                        ))}
                        <a href="#"
                            className="nav-link text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                salir();
                            }}>Cerrar sesión</a>
                    </nav>
                </aside>
                <main className="col p-4"
                    style={{
                        backgroundImage: `url(${fondo2})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className='d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm'>
                        <div>
                            <h4 className='mb-0 text-success'>{titulo}</h4>
                            <small className='text-secondary'>
                                {usuario.Nombre || ''} {usuario.Apellidos || ''}
                            </small>
                        </div>
                        <button type="button"
                            className="btn btn-outline-success"
                            onClick={() => setMostrarPerfil(!mostrarPerfil)}>
                            Perfil
                        </button>
                    </div>
                    {mostrarPerfil ? (
                        <div className='card mx-auto shadow' style={{ maxWidth: '500px' }}>
                            <div className='card-body text-center'>
                                <h4 className='text-success mb-4'>Mi perfil</h4>
                                <p>
                                    <strong>Nombre:</strong> {usuario.Nombre || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Apellidos:</strong> {usuario.Apellidos || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Correo:</strong> {usuario.Correo || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Telefono:</strong> {usuario.Telefono || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Cedula:</strong> {usuario.Cedula || 'No disponible'}
                                </p>
                                <button type='button' className='btn btn-secondary mt-3' onClick={() => setMostrarPerfil(false)}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
}

export default LayoutPerfil;