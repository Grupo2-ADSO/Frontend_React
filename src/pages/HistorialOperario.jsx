import ResourceList from '../components/ResourceList';

function HistorialOperario() {
    return (
        <section>
            <div className="page-heading">
                <h2>Historial</h2>
                <p>Actividades registradas en el sistema de mantenimiento.</p>
            </div>

            <ResourceList slug="historial" />
        </section>
    );
}

export default HistorialOperario;