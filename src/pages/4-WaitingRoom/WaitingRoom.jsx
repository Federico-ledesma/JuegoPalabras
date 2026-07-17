import NavBar from "../../components/NavBar/Navbar"
import Button from "../../components/Button"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Codigo from "../../components/Codigo/Codigo"

import { db } from "../../firebase/firebase"

import { doc, onSnapshot} from "firebase/firestore"
import { updateDoc } from "firebase/firestore"

import "../4-WaitingRoom/WaitingRoom.css"

import Logo from "../../assets/Logo.png"

import { FaRegCopy } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io"

function SalaEspera() {


    const { codigo } = useParams();

    const navigate = useNavigate();

    const tipoJugador = localStorage.getItem("jugador");
    
    const [sala,setSala] = useState(null);

    useEffect(()=>{


        const salaRef = doc(
            db,
            "salas",
            codigo
        );



        const unsubscribe = onSnapshot(
            salaRef,
            (snapshot)=>{


                if(snapshot.exists()){


                    const datos = snapshot.data();


                    setSala(datos);



                    // si hay 2 jugadores
                    if(datos.estado === "jugando"){

                        navigate(`/crear-palabra/${codigo}`);

                    }


                }


            }

        );


        return ()=>unsubscribe();



    },[codigo,navigate]);


    const iniciarJuego = async () => {

    const salaRef = doc(db, "salas", codigo);

    await updateDoc(salaRef, {
        estado: "jugando",
        turno: "jugador1",
        inicioPartida: Date.now()
    });

};

        const copiarCodigo = async () => {

    try {

        await navigator.clipboard.writeText(codigo);

        alert("✅ Código copiado al portapapeles");

    } catch (error) {

        alert("No se pudo copiar el código");

    }

};

        const compartirCodigo = async () => {

    const texto = `¡Únete a mi partida!

Código: ${codigo}`;

    // Si el navegador permite compartir
    if (navigator.share) {

        try {

            await navigator.share({

                title: "Invitación",
                text: texto

            });

        } catch (error) {

            console.log("Compartir cancelado");

        }

        return;

    }

    // Si está en PC, copia el código
    await navigator.clipboard.writeText(codigo);

    alert("✅ Código copiado al portapapeles");

};

    return(
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            <h1 className="titulo-espera">SALA DE ESPERA</h1>
            <p className="subtitulo-espera">Comparte el código de la sala con tu amigo para que se una</p>
            <hr className="separador separador-1"></hr>

            {/*Codigo Sala*/}
            <div className="codigo-sala-container">
                <h2 className="titulo-codigo-sala">CÓDIGO DE LA SALA</h2>
                <div className="codigo-container">
                    <span className="codigo sala">{codigo}</span>
                    <div
                        className="icono-codigo-container"
                        onClick={copiarCodigo}
                    >
                        <FaRegCopy className="icono-codigo-sala"/>
                    </div>
                </div>
                    <Button
                        className="Btn1 Btn6"
                        text="COMPARTIR CÓDIGO"
                        icon={<FaShareAlt />}
                        onClick={compartirCodigo}
                    />

                <hr className="separador separador-2"></hr>



                <h3 className="titulo-jugadores">JUGADORES</h3>
                <div className="jugadores-container">
                    <div className="jugadores">
                        <img src={Logo} className="logo"></img>
                        <div>

                            <p className="nombre-jugador">
                                {
                                    sala?.jugador1
                                    ? sala.jugador1.nombre
                                    : "Cargando..."
                                }
                            </p>

                            <span className="listo">
                                <FaCircle color="#22c55e" />
                                {" Conectado"}
                            </span>
                        </div>

                    </div>

                    <div className="jugadores">
                        <img src={Logo} className="logo"></img>
                        <div>
                            <p className="nombre-jugador">
                                {
                                    sala?.jugador2
                                    ? sala.jugador2.nombre
                                    : "Esperando..."
                                }
                            </p>
                            {
                                sala?.jugador2 ? (
                                    <span className="listo">
                                        <FaCircle color="#22c55e" />
                                        {" Conectado"}
                                    </span>
                                ) : (
                                    <span className="espera">
                                        <FaCircle color="#ef4444" />
                                        {" Esperando jugador..."}
                                    </span>
                                )
                            }
                        </div>

                    </div>

                    {
                        sala?.jugador2 &&
                        tipoJugador === "jugador1" && (
                            <Button
                                className="Btn1"
                                text="INICIAR JUEGO"
                                onClick={iniciarJuego}
                            />
                        )
                    }

                </div>

            </div>

            {/*Pasos*/}
            <div className="pasos-container">
                <div className="pasos">
                    <img src={Logo} className="logo"></img>
                    <div>
                        <span className="titulo-paso">1. Crea la sala</span>
                        <p className="paso">Ya creaste la sala y generamos un código único para vos.</p>
                    </div>
                </div>
                <div className="pasos">
                    <img src={Logo} className="logo"></img>
                    <div>
                        <span className="titulo-paso">2. Comparte el código</span>
                        <p className="paso">Enviale el código a tu amigo para que se una a la sala.</p>
                    </div>
                </div>
                <div className="pasos">
                    <img src={Logo} className="logo"></img>
                    <div>
                        <span className="titulo-paso">3. !A jugar!</span>
                        <p className="paso">Cuando tu amigo entre, comenzarán a jugar.</p>
                    </div>
                </div>
            </div>        

            <Button className="Btn1 Btn5" text=" CANCELAR SALA" icon={<IoMdExit />}/>

        
        
        
        
        
        
        </>
    )
}

export default SalaEspera