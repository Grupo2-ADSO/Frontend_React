import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";

import Inicio from "./pages/Inicio";
import OrdenesTrabajo from "./pages/OrdenesTrabajo";
import Evidencias from "./pages/Evidencias";
import HistorialOperario from "./pages/HistorialOperario";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta principal */}
        <Route
          path="/"
          element={<Navigate to="/inicio" replace />}
        />

        {/* Layout general */}
        <Route element={<Layout />}>

          <Route
            path="/inicio"
            element={<Inicio />}
          />

          <Route
            path="/ordenes"
            element={<OrdenesTrabajo />}
          />

          <Route
            path="/evidencias"
            element={<Evidencias />}
          />

          <Route
            path="/historial"
            element={<HistorialOperario />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;