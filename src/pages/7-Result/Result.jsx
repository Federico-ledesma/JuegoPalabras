import NavBar from "../../components/NavBar/Navbar"
import Button from "../../components/Button";
import TablaNaruto from "../../components/Tabla";

import "../7-Result/Result.css"

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "../../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import Logo from "../../assets/Logo.png"

import { FaPagelines } from "react-icons/fa";
import { BsFillAwardFill } from "react-icons/bs";
import { IoLogoGameControllerB } from "react-icons/io";
import { RiTargetFill } from "react-icons/ri";
import { CiStar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { FaCrown } from "react-icons/fa6";
import { FaRepeat } from "react-icons/fa6";
import { FaHouseChimney } from "react-icons/fa6";

function Resultado() {

    const { codigo } = useParams();

    const nombreJugador = localStorage.getItem("nombreJugador");

    const navigate = useNavigate();

    const [sala, setSala] = useState(null);


    useEffect(() => {

        const salaRef = doc(
            db,
            "salas",
            codigo
        );

        const unsubscribe = onSnapshot(
            salaRef,
            (snapshot) => {

                if (snapshot.exists()) {
                    setSala(snapshot.data());
                }

            }
        );

        return () => unsubscribe();

    }, [codigo]);




    useEffect(()=>{

        if(!sala) return;


        const ambosAceptaron =
            sala.revancha?.jugador1 &&
            sala.revancha?.jugador2;


        if(ambosAceptaron){

            reiniciarPartida();

        }


    },[sala]);

    if(!sala){
        return <h1>Cargando resultado...</h1>
    }

    const ganador =
        sala.ganador === "jugador1"
        ? sala.jugador1
        : sala.jugador2;

    const perdedor =
        sala.ganador === "jugador1"
        ? sala.jugador2
        : sala.jugador1;

    const jugadorActualID =
    sala.jugador1.nombre === nombreJugador
        ? "jugador1"
        : "jugador2";

    const palabrasJugador1 = sala.palabras.jugador1;

    const palabrasJugador2 = sala.palabras.jugador2;

    const historial = sala.historial || [];

    const duracionMs =
    (sala.finPartida || 0) - (sala.inicioPartida || 0);

    const minutos = Math.floor(duracionMs / 60000);

    const segundos = Math.floor((duracionMs % 60000) / 1000);

    const duracion =
        `${minutos}:${segundos.toString().padStart(2,"0")}`;

    const palabrasJugadas = historial.length;

    const aciertosTotales = historial.length;

    const letrasPedidas = historial.reduce(
        (total, item) => total + item.letrasPedidas,
        0
    );




    const aceptarRevancha = async()=>{

        const salaRef = doc(
            db,
            "salas",
            codigo
        );


        await updateDoc(
            salaRef,
            {
                [`revancha.${jugadorActualID}`]: true
            }
        );

    };


    const reiniciarPartida = async()=>{


        const salaRef = doc(
            db,
            "salas",
            codigo
        );


        await updateDoc(
            salaRef,
            {

                estado:"esperando",

                ganador:null,

                historial:[],

                jugador1:{
                    ...sala.jugador1,
                    puntos:0,
                    listo:false
                },


                jugador2:{
                    ...sala.jugador2,
                    puntos:0,
                    listo:false
                },


                palabras:{
                    jugador1:[],
                    jugador2:[]
                },


                progreso:{
                    jugador1:0,
                    jugador2:0
                },


                letrasUsadas:{
                    jugador1:[],
                    jugador2:[]
                },


                revancha:{
                    jugador1:false,
                    jugador2:false
                },


                turno:"jugador1"

            }
        );


        navigate(`/espera/${codigo}`);

    };


    return(
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div> 

            <div className="titulo-resultado-container">
                <span className="span icono-resultado1"><FaPagelines /></span>
                <h1>RESULTADO</h1>
                <span className="span icono-resultado2"><FaPagelines /></span>
            </div>
            <p className="partida-finalizada">!Partida finalizada!</p>

            <div className="ganador-container">

                <div className="ganador1-container">

                    <FaCrown className="icono-corona"/>

                    <img
                        className="logo"
                        src={Logo}
                        alt="Logo iniciales"
                    />

                    <h2>
                        {ganador.nombre}
                    </h2>

                    <span>
                        {ganador.puntos}
                    </span>

                    <span>
                        puntos
                    </span>

                </div>


                <div className="ganador2-container">

                    <img
                        className="logo"
                        src={Logo}
                        alt="Logo iniciales"
                    />

                    <h2>
                        {perdedor.nombre}
                    </h2>

                    <span>
                        {perdedor.puntos}
                    </span>

                    <span>
                        puntos
                    </span>

                </div>

            </div>

            <h2>RESUMEN DE LA PARTIDA</h2>
            <div className="resumen-container">

                <div className="resumen">
                    <IoLogoGameControllerB />
                    <p>Palabras jugadas</p>
                    <span>{palabrasJugadas}</span>
                </div>

                <div className="resumen">
                    <RiTargetFill />
                    <p>Aciertos totales</p>
                    <span>{aciertosTotales}</span>
                </div>

                <div className="resumen">
                    <CiStar />
                    <p>Letras pedidas</p>
                    <span>{letrasPedidas}</span>
                </div>

                <div className="resumen">
                    <CiClock2 />
                    <p>Duracion</p>
                    <span>{duracion}</span>
                </div>
            </div>

            <div className="puntos-container">
                <TablaNaruto historial={historial}/>
            </div>

            <div>
                <Button 
                    className="Btn1"
                    text="JUGAR OTRA PARTIDA"
                    icon={<FaRepeat/>}
                    onClick={aceptarRevancha}
                />
                <Button className="Btn2" text="VOLVER AL INICIO" icon={<FaHouseChimney />}/>
            </div>
        
        </>
    )
}

export default Resultado;