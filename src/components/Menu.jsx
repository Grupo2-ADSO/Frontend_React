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
          <NavLink to="/">
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink to="/ordenes">
            Orden de trabajos
          </NavLink>
        </li>

        <li>
          <NavLink to="/evidencias">
            Evidencias
          </NavLink>
        </li>

        <li>
          <NavLink to="/historial">
            Historial del Operario
          </NavLink>
        </li>

        <li>
          <button type="button">
            Cerrar Sesión
          </button>
        </li>
      </ol>
    </nav>
  );
}

export default Menu;