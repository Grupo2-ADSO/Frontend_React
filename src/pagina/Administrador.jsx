import { useState } from 'react'
import izquierda from '../assets/izquierda.jpeg'
import Sergio from '../assets/Sergio.jpeg'
import '../estilos/Admin.css'

function Administrador({ cerrandoSesion }) {
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
                    <span className="titulo">Administrador</span>
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
                                <img src={Sergio} className="perfiles" />
                                <span className="nombre">
                                    Sergio Alejandro Maldonado Carrillo
                                </span>
                                <span className="rol">
                                    Administrador
                                </span>
                                <span className="informacion">
                                    Numero: +57 320 4698134
                                </span>
                                <span className="informacion">
                                    Email: chequioAdmin@email.com
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

export default Administrador