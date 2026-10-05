import { BrowserRouter, Routes, Route} from "react-router-dom";
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
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="ordenes-trabajo" element={<OrdenesTrabajo />} />
        <Route path="evidencias" element={<Evidencias />} />
        <Route path="historial-operario" element={<HistorialOperario />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;