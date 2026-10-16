import { useState } from 'react';
import ResourceList from '../components/ResourceList';
import api from '../services/api';
import { getRole } from '../services/auth';

function EvidenciaOperario() {
    const [json, setJson] = useState('{\n  \n}');
    const [file, setFile] = useState(null);
    const [fileField, setFileField] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [saving, setSaving] = useState(false);

    async function guardar(event) {
        event.preventDefault();
        setError('');
        setNotice('');

        let payload;

        try {
            payload = JSON.parse(json);

            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                throw new Error('Los datos deben ser un objeto JSON.');
            }
        } catch (errorJSON) {
            setError('JSON inválido: ' + errorJSON.message);
            return;
        }

        if (file && !fileField.trim()) {
            setError('Escribe el nombre del campo de archivo.');
            return;
        }

        let body = payload;

        if (file) {
            body = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                body.append(key, typeof value === 'object' && value !== null
                    ? JSON.stringify(value)
                    : String(value ?? ''));
            });

            body.append(fileField.trim(), file);
        }

        setSaving(true);

        try {
            await api.post('/evidencias', body);
            setNotice('Evidencia enviada correctamente.');
            setJson('{\n  \n}');
            setFile(null);
        } catch (errorSolicitud) {
            setError(errorSolicitud.response?.data?.message ?? 'No se pudo enviar la evidencia.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <section>
            <h2>Registrar evidencia</h2>

            <form onSubmit={guardar}>
                <label htmlFor="datos-evidencia">Datos de la evidencia (JSON)</label>
                <textarea
                    id="datos-evidencia"
                    rows="8"
                    value={json}
                    onChange={(event) => setJson(event.target.value)}
                />

                <label htmlFor="campo-archivo">Nombre del campo de archivo</label>
                <input
                    id="campo-archivo"
                    value={fileField}
                    onChange={(event) => setFileField(event.target.value)}
                    placeholder="archivo"
                />

                <label htmlFor="archivo-evidencia">Archivo</label>
                <input
                    id="archivo-evidencia"
                    type="file"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />

                {error && <p role="alert">{error}</p>}
                {notice && <p role="status">{notice}</p>}

                <button type="submit" disabled={saving}>
                    {saving ? 'Enviando...' : 'Enviar evidencia'}
                </button>
            </form>
        </section>
    );
}

function Evidencias() {
    const role = getRole();

    return (
        <section>
            {role === 3
                ? <EvidenciaOperario />
                : <ResourceList slug="evidencias" />}
        </section>
    );
}

export default Evidencias;