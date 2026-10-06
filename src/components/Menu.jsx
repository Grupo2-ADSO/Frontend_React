import { NavLink } from "react-router-dom";


function Menu() {
  return (
    <nav>
      <ol id="menu">
        <img
          src="/img/logo.jpg"
          alt="Logo Holiday Inn"
          id="logo"
        />

        <li>
          <NavLink to="inicio">
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink to="/Ordenes">
            Orden de trabajos
          </NavLink>
        </li>

        <li>
          <NavLink to="/Evidencias">
            Evidencias
          </NavLink>
        </li>

        <li>
          <NavLink to="/Historial">
            Historial del Operario
          </NavLink>
        </li>

        <li>
          <button id="cerrar-sesion"> Cerrar Sesión </button>
        </li>
      </ol>
    </nav>
  );
}

export default Menu;