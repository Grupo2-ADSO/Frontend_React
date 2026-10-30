import { useSearchParams, Link } from "react-router-dom";

function VerificarCorreo() {
    const [parametros] = useSearchParams()

    const estado = parametros.get('estado')
    const mensaje = parametros.get('mensaje')

    const exito = estado === 'exito';
    return (
        <div className="container d-flex justify-content-center align-items-center py-5">
            <div className="card shadow border-0 text-center p-4 p-md-5"
                style={{ maxWidth: '500px', width: '100%', borderRadius: '20px' }}
            >
                <div className={`rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4 ${exito ? 'bg-success-subtle' : 'bg-danger-subtle'
                    }`}
                    style={{ width: '85px', height: '85px', fontSize: '40px' }}>
                    {exito ? '✓' : '✉'}
                </div>
                <h2 className="fw-bold mb-3">
                    {exito ? '¡Correo verificado!' : 'Verificacion de correo'}
                </h2>
                <p className="text-secondary mb-4">
                    {mensaje || 'No se recibio un resultado de verificacion.'}
                </p>
                {exito ? (
                    <div className="alert alert-success rounded-3">
                        Tu correo se ha verificado correctamente.
                        Ya puedes volver a tu perfil.
                    </div>
                ) : (
                    <div className="alert alert-danger rounded-3">
                        El enlace puede ser invalidado o haber caducado.
                        Solicita uno nuevo si lo nesecitas
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerificarCorreo