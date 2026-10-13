import '../estilos/CerrarSesion.css'

function CerrarSesion({ volver, salir }) {
    const cerrar = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        localStorage.removeItem('rol')
        salir()
    }

    return (
        <main className="fondo">
            <div className="mensaje">
                <div className="mensajeCuadro">
                    <h2>¿Estas seguro de cerrar sesion?</h2>
                    <button className="botonVolver" onClick={cerrar}>
                        Cerrar Sesion
                    </button>
                    <button className='botonVolver' onClick={volver}>
                        Atras
                    </button>
                </div>
            </div>
        </main>
    )
}

export default CerrarSesion