import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import Evidencias from './pages/Evidencias';
import GestionRecurso from './pages/GestionRecurso';
import HistorialOperario from './pages/HistorialOperario';
import InformacionSistema from './pages/InformacionSistema';
import Inicio from './pages/Inicio';
import OrdenesTrabajo from './pages/OrdenesTrabajo';
import { getHomePath } from './services/auth';

function HomeRedirect() {
  return <Navigate to={getHomePath()} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/admin" element={<RequireRole roles={[1]}><Administrador /></RequireRole>} />
          <Route path="/admin/informacion" element={<RequireRole roles={[1]}><InformacionSistema /></RequireRole>} />
          <Route path="/admin/:recurso" element={<RequireRole roles={[1]}><GestionRecurso /></RequireRole>} />
          <Route path="/supervisor" element={<RequireRole roles={[2]}><Supervisor /></RequireRole>} />
          <Route path="/operario" element={<RequireRole roles={[3]}><Operario /></RequireRole>} />
          <Route path="/ordenes" element={<OrdenesTrabajo />} />
          <Route path="/operario/ordenes" element={<Navigate to="/ordenes" replace />} />
          <Route path="/evidencias" element={<RequireRole roles={[2, 3]}><Evidencias /></RequireRole>} />
          <Route path="/operario/evidencias" element={<Navigate to="/evidencias" replace />} />
          <Route path="/historial" element={<RequireRole roles={[3]}><HistorialOperario /></RequireRole>} />
          <Route path="/operario/historial" element={<Navigate to="/historial" replace />} />
          <Route path="*" element={<HomeRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
