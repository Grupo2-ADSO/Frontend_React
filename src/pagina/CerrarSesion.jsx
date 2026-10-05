import '../estilos/CerrarSesion.css'

function CerrarSesion({ volver }) {
    const cerrar = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        localStorage.removeItem('rol')

        volver()
    }

    return (
        <main className="fondo">
            <div className="mensaje">
                <div className="mensajeCuadro">
                    <h2>¿Estas seguro de cerrar sesion?</h2>
                    <button className="botonVolver" onClick={cerrar}>
                        Cerrar Sesion
                    </button>
                    <button className='bontonVolver' onClick={volver}>
                        Atras
                    </button>
                </div>
            </div>
        </main>
    )
}

export default CerrarSesion