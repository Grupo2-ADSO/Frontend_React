import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Administrador from "./pages/Administrador";
import Supervisor from "./pages/Supervisor";
import Operario from "./pages/Operario";
import OrdenesTrabajo from "./pages/OrdenesTrabajo";
import Evidencias from "./pages/Evidencias";
import GestionRecurso from "./pages/GestionRecurso";
import InformacionSistema from "./pages/InformacionSistema";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import CerrarSesion from "./pages/CerrarSesion";
import Usuarios from "./pages/Usuario";
import Reportes from "./pages/Reportes";
import Historial from "./pages/Historial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/informacion"
          element={
            <RequireAuth>
              <RequireRole roles={[1]}>
                <InformacionSistema />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/ordenes"
          element={<Navigate to="/ordenes" replace />}
        />

        <Route
          path="/admin/usuario"
          element={
            <RequireAuth>
              <RequireRole roles={[1]}>
                <Usuarios />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/reportes"
          element={
            <RequireAuth>
              <RequireRole roles={[1]}>
                <Reportes />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/:recurso"
          element={
            <RequireAuth>
              <RequireRole roles={[1]}>
                <GestionRecurso />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole roles={[1]}>
                <Administrador />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/supervisor"
          element={
            <RequireAuth>
              <RequireRole roles={[2]}>
                <Supervisor />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/operario"
          element={
            <RequireAuth>
              <RequireRole roles={[3]}>
                <Operario />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/ordenes"
          element={
            <RequireAuth>
              <OrdenesTrabajo />
            </RequireAuth>
          }
        />

        <Route
          path="/evidencias"
          element={
            <RequireAuth>
              <RequireRole roles={[2, 3]}>
                <Evidencias />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/historial"
          element={
            <RequireAuth>
              <RequireRole roles={[3]}>
                <Historial />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/cerrar-sesion"
          element={
            <CerrarSesion
              volver={() => window.history.back()}
              salir={() => {
                window.location.href = "/";
              }}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
