import NavBar from "../../components/NavBar/Navbar"
import Codigo from "../../components/Codigo/Codigo"
import Button from "../../components/Button"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { unirseSala } from "../../services/roomService"

import "../3-JoinRoom/JoinRoom.css"

import Logo from "../../assets/Logo.png"
import Fondo from "../../assets/Fondo.png"

import { IoLogoGameControllerB } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { IoMdBulb } from "react-icons/io";

function IngresarSala() {

    const [codigo,setCodigo] = useState("");

    const [nombreJugador,setNombreJugador] = useState("");



    const navigate = useNavigate();



    const handleUnirse = async()=>{


        if(!nombreJugador.trim() || !codigo.trim()){

            alert("Completa todos los campos");
            return;

        }


        try{


            const codigoSala = await unirseSala(
                codigo,
                nombreJugador
            );
            
            localStorage.setItem("jugador", "jugador2");
            localStorage.setItem("nombreJugador", nombreJugador);
            
            navigate(`/espera/${codigoSala}`);



        }catch(error){

            alert(error.message);

        }


    }




    return(
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            <div className="titulo-ingresar-container">
                <img src={Fondo} className="imagen-fondo"></img>
                <h1 className="titulo-ingresar">UNIRSE <br></br><span className="span">A UNA SALA</span></h1>
            </div>

            <div className="subtitulo-ingresar-container">
                <IoLogoGameControllerB className="icono-subtitulo"/>
                <p className="parrafo-subtitulo">Ingresa el código de la sala que te compartió tu amigo para unirte a la partida.</p>
            </div>

            <hr className="separador"></hr>

            {/* Unirse sala */}
            <div className="unirse-container">
                <div className="titulo-unirse-container">
                    <MdPeopleAlt className="icono-unirse"/>
                    <div>
                        <h2 className="titulo-unirse">INGRESA EL CÓDIGO</h2>
                        <p>Pídele a tu amigo el código de 6 caracteres.</p>
                    </div>
                </div>

                <Codigo codigo={codigo} setCodigo={setCodigo} />
                <input type="text" placeholder="Ingresa Tu Nombre" value={nombreJugador} onChange={(e)=>setNombreJugador(e.target.value)}></input>

                <div className="exclamacion-container">
                    <p className="exclamacion"><FaExclamation className="icono-exclamacion"/>El código de la sala tiene 6</p>
                    <p className="exclamacion"><FaExclamation className="icono-exclamacion"/>Caracteres (caracteres y numeros)</p>
                </div>

                <Button className="Btn1" text="UNIRSE A LA SALA" icon={<IoMdExit />} onClick={handleUnirse}    />
            </div>

            {/* Preguntas */}
            <div className="preguntas-container">
                <IoMdBulb className="icono-preguntas" />

                <div className="preguntas-info">
                    <h2 className="titulo-preguntas">
                        ¿CÓMO OBTENGO<br />EL CÓDIGO?
                    </h2>

                    <p className="parrafo-preguntas">
                        Tu amigo debe crear una sala y compartirte el código que se muestra en su pantalla.
                    </p>

                    <div className="codigo-box">
                        <p className="codigo-titulo">CÓDIGO DE SALA</p>

                        <div className="codigo-contenido">
                            <span className="codigo">A7K9P2</span>
                            <FaRegCopy className="icono-copy" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IngresarSala