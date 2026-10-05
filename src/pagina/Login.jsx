import CerrarSesion from "./CerrarSesion"
import axios from "axios"
import { useState, useEffect } from "react"
import Operario from "./Operario"
import Supervisor from "./Supervisor"
import Administrador from "./Administrador"

function Login() {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [rol, setRol] = useState(null)
    const [cerrandoSesion, setCerrandoSesion] = useState(false)

    useEffect(() => {
        const rolGuardar = localStorage.getItem('rol')

        if (rolGuardar) {
            setRol(Number(rolGuardar))
        }
    }, [])

    const iniciarSeion = async () => {
        try {
            const respuesta = await axios.post(
                'http://localhost:8000/api/login',
                {
                    Correo: correo,
                    Contrasena: clave
                }
            )
            const rolUsuario = respuesta.data.rol.IdRol
            localStorage.setItem('token', respuesta.data.token)
            localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))
            localStorage.setItem('rol', rolUsuario)

            setRol(rolUsuario)
        } catch (error) {
            console.log(error)
        }
    }
    if (cerrandoSesion) {
        return (
            <CerrarSesion volver={() => {
                setRol(null)
                setCerrandoSesion(false)
            }} />
        )
    }
    if (rol === 1) {
        return <Administrador cerrandoSesion={() => setCerrandoSesion(true)} />
    }

    if (rol === 2) {
        return <Supervisor cerrandoSesion={() => setCerrandoSesion(true)} />
    }

    if (rol === 3) {
        return <Operario cerrandoSesion={() => setCerrandoSesion(true)} />
    }

    return (
        <div className="fondo">
            <div className="sesion">
                <div className="sesionCuadro">
                    <h2>Iniciar Sesion</h2>
                    <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
                    <button onClick={iniciarSeion}>
                        Iniciar Sesion
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login