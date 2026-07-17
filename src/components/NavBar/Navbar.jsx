import { useState } from "react";
import { Link } from "react-router-dom";
import "../NavBar/Navbar.css"

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      
      <nav className={`menu ${open ? "show" : ""}`}>
        <Link to="/">Inicio</Link>
        <Link to="/crear-sala">Crear Sala</Link>
        <Link to="/ingresar-sala">Ingresar Sala</Link>
        <Link to="/espera/:codigo">Sala Espera</Link>
        <Link to="/crear-palabra">Crear Palabra</Link>
        <Link to="/Juego">Juego</Link>
        <Link to="/resultado">Resultado</Link>
      </nav>

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}

export default NavBar;