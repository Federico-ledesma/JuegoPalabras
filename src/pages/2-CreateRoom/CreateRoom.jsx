import "../2-CreateRoom/CreateRoom.css"
import NavBar from "../../components/NavBar/Navbar";
import Button from "../../components/Button"

import { crearSala } from "../../services/roomService";
import { useNavigate } from "react-router-dom";


import Logo from "../../assets/Logo.png"

import { MdPeopleAlt } from "react-icons/md";
import { LuClock12 } from "react-icons/lu";
import { CiClock2 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaStudiovinari } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import { PiFilmSlateFill } from "react-icons/pi";
import { FaFutbol } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import { FaTv } from "react-icons/fa";
import { useState } from "react";


function CrearSala() {

    const [nombreJugador, setNombreJugador] = useState("");

    const navigate = useNavigate();

    const handleCrearSala = async () => {

    if (!nombreJugador.trim()) {
        alert("Ingresa un nombre.");
        return;
    }

    const codigo = await crearSala(nombreJugador);

    localStorage.setItem("jugador", "jugador1");
    localStorage.setItem("nombreJugador", nombreJugador);

    navigate(`/espera/${codigo}`);
};


    return(
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            <div className="titulo-crear-sala-container">
                <img className="logo-crear-sala" src={Logo} alt="Logo iniciales" />
                <h1 className="crear-sala-titulo">Crear <span className="span">Sala</span></h1>
                <p className="subtitulo-crear-sala">Crea una sala privada y comparte el codigo con tu amigo para empezar a jugar.</p>
            </div>

            <div className="crear-sala-container">
                    <span className="icono"> <MdPeopleAlt/>1. Ingresa Tu Nombre</span>
                    <div className="ingresar-nombre-container">
                        <input type="text" placeholder="Escribe Tu Nombre" className="input-nombre" value={nombreJugador} onChange={(e) => setNombreJugador(e.target.value)}></input>
                    </div>

                <div className="separador"></div>

                
                <span className="icono"><MdPeopleAlt/>2. Elige Una Categoria (Opcional)</span>
                
                <div className="categoria-container">
                    


                    <div className="icono-categoria-container">
                            <button className="Btn4">
                                <FaStudiovinari />
                                Anime
                            </button>

                            <button className="Btn4">
                                <IoLogoGameControllerB />
                                Videojuegos
                            </button>

                            <button className="Btn4">
                                <PiFilmSlateFill/>
                                Peliculas
                            </button>
                    
                            <button className="Btn4">
                                <FaFutbol/>
                                Deportes
                            </button>

                            <button className="Btn4">
                                <FaMusic/>
                                Musica
                            </button>

                            <button className="Btn4">
                                <FaTv/>
                                Series
                            </button>
                    </div>
                    
                    
                </div>

                <div className="separador"></div>
                
                <span className="icono"><MdPeopleAlt/>3. Configuracion De La Sala</span>
                        
                        <div className="boton-crear-container">
                            
                            <span className="titulo-boton-configuracion"><LuClock12 />Rondas</span>

                            <div className="boton">
                                <button className="boton-configuracion">-</button>
                                <span className="contador">5</span>
                                <button className="boton-configuracion">+</button>
                            </div>

                            
                            <span className="titulo-boton-configuracion"><CiClock2 />Tiempo Por Turno</span>
                            <div className="boton">
                                <button className="boton-configuracion">-</button>
                                <span className="contador">60</span>
                                <button className="boton-configuracion">+</button>
                            </div>


                        </div>
                        
                
            </div>
            
                <div className="boton-sala-container">
                    <Button className={"Btn1"} icon={<FaPlus/>} text="CREAR SALA" onClick={handleCrearSala}/>
                    <Button className={"Btn2"} icon={<FaRegQuestionCircle />} text="COMO FUNCIONA"/>
                </div>
        </>
    )
}

export default CrearSala;