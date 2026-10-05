import { useState } from 'react'
import izquierda from '../assets/izquierda.jpeg'
import imagenPerfil from '../assets/imagenPerfil.jpeg'
import '../estilos/Supervisor.css'

function Supervisor(cerrandoSesion) {
    const [pagina, setPagina] = useState('inicio')

    return (
        <div className="contenedor">
            <aside className="columnaIzquierda">
                <img src={izquierda} className="logo" />
                <nav className="menu">
                    <a href="" className="menuLateral">Inicio</a>
                    <a href="" className="menuLateral">Crear Ordenes</a>
                    <a href="" className="menuLateral">Ordenes</a>
                    <a href="" className="menuLateral">Usarios</a>
                    <a href="" className="menuLateral">Reportes</a>
                    <a href="" className="menuLateral" onClick={(e) => {
                        e.preventDefault()
                        cerrandoSesion()
                    }}>
                        Cerrar sesion
                    </a>
                </nav>
            </aside>
            <main className="contenido">
                <div className="linea">
                    <span className="titulo">Supervisor</span>
                    <a href="" className="perfil" onClick={(e) => {
                        e.preventDefault()
                        setPagina('perfil')
                    }}>
                        Perfil
                    </a>
                </div>
                {pagina === 'perfil' && (
                    <section className="seccionPerfil">
                        <div className="cuadroCentro">
                            <div className="encabezado">
                                <span className="estado">
                                    👤 Activo
                                </span>
                            </div>
                            <div className="imagenPerfil">
                                <img src={imagenPerfil} className="perfiles" />
                                <span className="nombre">
                                    chequio
                                </span>
                                <span className="rol">
                                    Supervisor
                                </span>
                                <span className="informacion">
                                    Numero: +57 321 4618131
                                </span>
                                <span className="informacion">
                                    Email: sergioSuper@email.com
                                </span>
                                <a href="" className="volver">
                                    Atras
                                </a>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default Supervisor