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
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('El cuerpo debe ser un objeto JSON.');
    } catch (parseError) {
      setError('JSON inválido: ' + parseError.message);
      return;
    }
    if (file && !fileField.trim()) {
      setError('Escribe el nombre exacto del campo de archivo que espera la API.');
      return;
    }

    let body = payload;
    if (file) {
      body = new FormData();
      Object.entries(payload).forEach(([key, value]) => body.append(key, typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '')));
      body.append(fileField.trim(), file);
    }

    setSaving(true);
    try {
      await api.post('/evidencias', body);
      setNotice('Evidencia enviada correctamente.');
      setJson('{\n  \n}');
      setFile(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? 'No se pudo enviar la evidencia.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="content-card json-editor" onSubmit={guardar}>
      <h3>Registrar evidencia</h3>
      <p>Completa el objeto con los campos que solicita el backend. Si adjuntas un archivo, escribe su campo exacto.</p>
      <label htmlFor="evidencia-json">Datos de la evidencia (JSON)</label>
      <textarea id="evidencia-json" rows="10" value={json} onChange={(event) => setJson(event.target.value)} spellCheck="false" />
      <label htmlFor="evidencia-campo-archivo">Campo de archivo (si aplica)</label>
      <input id="evidencia-campo-archivo" value={fileField} onChange={(event) => setFileField(event.target.value)} placeholder="Nombre que espera la API" />
      <label htmlFor="evidencia-archivo">Archivo (opcional)</label>
      <input id="evidencia-archivo" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}
      <button className="button" type="submit" disabled={saving}>{saving ? 'Enviando…' : 'Enviar evidencia'}</button>
    </form>
  );
}

function Evidencias() {
  const role = getRole();

  return (
    <section>
      <div className="page-heading">
        <h2>Evidencias</h2>
        <p>Archivos y registros asociados a las actividades de mantenimiento.</p>
      </div>
      {role === 3 ? <EvidenciaOperario /> : <ResourceList slug="evidencias" />}
    </section>
  );
}

export default Evidencias;
