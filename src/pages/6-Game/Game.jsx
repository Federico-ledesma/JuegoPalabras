import NavBar from "../../components/NavBar/Navbar";
import Button from "../../components/Button"

import "../6-Game/Game.css"

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase/firebase"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"


import Logo from "../../assets/Logo.png"

import { FaListAlt } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

function Juego() {

    const navigate = useNavigate();

    console.log("Entre al juego")

    const { codigo } = useParams();

    const [sala,setSala] = useState(null);

    const [letraSeleccionada, setLetraSeleccionada] = useState("");

    const [letrasCorrectas, setLetrasCorrectas] = useState([]);

    const [letraIncorrecta, setLetraIncorrecta] = useState("");

    const nombreJugador = localStorage.getItem("nombreJugador");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    const letras = [
        "A","B","C","D","E","F","G",
        "H","I","J","K","L","M",
        "N","Ñ","O","P","Q","R",
        "S","T","U","V","W",
        "X","Y","Z"
    ];


    const [respuesta, setRespuesta] = useState("");


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

                    setSala(snapshot.data());

                }

            }
        );

        return ()=>unsubscribe();

    },[codigo]);



    useEffect(()=>{

        if(sala?.estado === "finalizado"){

            navigate(`/resultado/${codigo}`);

        }

    },[sala]);

    // //

    if(!sala){

        return <h1>Cargando partida...</h1>
    }

    const soyJugador1 =
    sala.jugador1.nombre === nombreJugador;


    const jugadorActual =
        soyJugador1
        ? sala.jugador1
        : sala.jugador2;
    
    
    const jugadorRival =
        soyJugador1
        ? sala.jugador2
        : sala.jugador1;

    const palabrasRival = 
        soyJugador1
        ? sala.palabras.jugador2
        : sala.palabras.jugador1;
    
    
    



    const jugadorActualID = soyJugador1
    ? "jugador1"
    : "jugador2";

    

    const progresoJugador = sala.progreso?.[jugadorActualID] ?? 0;

    const palabraActual = palabrasRival?.[progresoJugador];

    const letrasJugador = sala.letrasUsadas?.[jugadorActualID] || [];

    const palabrasMostradas = palabrasRival?.map((palabra,index)=>{

    const completada = palabra
        .toUpperCase()
        .split("")
        .every(letra=>letrasJugador.includes(letra));


    return {
        numero:index + 1,
        palabra,
        completada
    }

});

    const pedirLetra = async(letra)=>{

        if(!letra){
            return;
        }

        letra = letra.toUpperCase();


        const salaRef = doc(
            db,
            "salas",
            codigo
        );


        const letrasActuales =
            sala.letrasUsadas?.[jugadorActualID] || [];


        if(letrasActuales.includes(letra)){
            return;
        }


        const palabra =
            palabraActual.toUpperCase();


        const existe =
            palabra.includes(letra);

        if(existe){
                
            setLetrasCorrectas(prev=>[
                ...prev,
                letra
            ]);
        
        }

        if(existe && !letrasCorrectas.includes(letra)){

            setLetrasCorrectas(prev=>[
                ...prev,
                letra
            ]);
        
        }



        const nuevasLetras = [
            ...letrasActuales,
            letra
        ];



        const datosActualizar = {

            [`letrasUsadas.${jugadorActualID}`]:
                nuevasLetras

        };



        // Si la letra NO existe cambia turno
        if(!existe){

            setLetraIncorrecta(letra);

        const nuevoTurno =
            sala.turno === "jugador1"
            ? "jugador2"
            : "jugador1";


        console.log("CAMBIO TURNO A:", nuevoTurno);


        datosActualizar.turno = nuevoTurno;

    }

        console.log("MI ID:", jugadorActualID);
        console.log("TURNO ACTUAL:", sala.turno);
        console.log("LETRA:", letra);
        console.log("EXISTE:", existe);

        await updateDoc(
            salaRef,
            datosActualizar
        );

    };



    const adivinarPalabra = async() => {

    if(!palabraActual){
        return;
    }


    const palabraCorrecta = palabraActual.toUpperCase();


    const salaRef = doc(
        db,
        "salas",
        codigo
    );


    // RESPUESTA CORRECTA
    if(respuesta.toUpperCase() === palabraCorrecta){


        const puntosGanados = Math.max(
            100 - (letrasJugador.length * 10),
            0
        );


        const puntosActuales = jugadorActual.puntos;


        const nuevoProgreso = progresoJugador + 1;


        const termino =
            nuevoProgreso >= 5;

        const historialActual = sala.historial || [];

        const nuevoRegistro = {
            palabra: palabraActual,
            autor: jugadorRival.nombre,
            adivinador: jugadorActual.nombre,
            letrasPedidas: letrasJugador.length,
            puntos: puntosGanados
        };

        await updateDoc(
            salaRef,
            {

                [`${jugadorActualID}.puntos`]:
                    puntosActuales + puntosGanados,


                progreso:{
                    ...sala.progreso,
                    [jugadorActualID]: nuevoProgreso
                },

                historial:[
                    ...historialActual,
                    nuevoRegistro
                ],

                letrasUsadas:{
                    jugador1:[],
                    jugador2:[]
                },


                ...(termino && {
                ganador: jugadorActualID,
                finPartida: Date.now(),
                                
                    revancha: {
                        jugador1: false,
                        jugador2: false
                    }
                })

            }
        );


        setTipoMensaje("correcto");
        setMensaje(`🎉 ¡CORRECTO! +${puntosGanados} puntos`);

        setTimeout(async()=>{

            setMensaje("");

            if(termino){
            
                await updateDoc(salaRef,{
                    estado:"finalizado"
                });
            
            }
        
        },2000);


    }else{


        // RESPUESTA INCORRECTA
        const siguienteTurno =
            sala.turno === "jugador1"
            ? "jugador2"
            : "jugador1";


        await updateDoc(
            salaRef,
            {

                turno:siguienteTurno

            }
        );


        setTipoMensaje("error");
        setMensaje("❌ INCORRECTO");

        setTimeout(()=>{
            setMensaje("");
        },2000);

    }

};


    const palabraOculta = palabraActual
        ?
        palabraActual
        .toUpperCase()
        .split("")
        .map((letra)=>{
        
            if(letrasJugador.includes(letra)){
                return letra;
            }
        
            return "_";
        
        })
        .join(" ")
        :"";

    const palabraCompleta = palabraActual
        ?
        palabraActual
        .toUpperCase()
        .split("")
        .every(letra => letrasJugador.includes(letra))
        :
        false;

    const esMiTurno =
    sala.turno === jugadorActualID;

    return (
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            {
                mensaje && (
                    <div className={`mensaje-juego ${tipoMensaje}`}>
                        {mensaje}
                    </div>
                )
            }

            {/* Jugadores*/}
            <div className="juego-jugadores-container">
                <div className="jugador1">
                    <img className="logo jugador1-img" src={Logo} alt="Logo iniciales" />
                    <p className="nombre-jugador1">
                        {jugadorActual.nombre}
                    </p>
                    <span className="puntaje">{jugadorActual.puntos}</span>
                </div>

                <div
                    className={
                        esMiTurno
                            ? "turno turno-actual"
                            : "turno turno-espera"
                    }
                >
                
                    <span className="turno-icono">
                        {esMiTurno ? "🟢" : "⏳"}
                    </span>
                
                    <span className="turno-titulo">
                        {esMiTurno ? "TU TURNO" : "ESPERANDO"}
                    </span>
                
                    <span className="ronda">
                        Palabra {progresoJugador + 1}/5
                    </span>
                
                </div>

                <div className="jugador2">
                    <img className="logo jugador2-img" src={Logo} alt="Logo iniciales" />
                    <p className="nombre-jugador2">
                        {jugadorRival.nombre}
                    </p>
                    <span className="puntaje">{jugadorRival.puntos}</span>
                </div>
            </div>


            {/* Jugadores*/}
            
            <div>
                
                <div>
                    <div className="palabra-juego-container">

                    <h1>
                        PALABRA {sala.rondaActual}
                    </h1>

                    <div className="palabra-oculta">
                        {palabraOculta}
                    </div>

                    <p>
                        Pide una letra o intenta adivinar la palabra completa
                    </p>

                </div>

                    <hr></hr>

                    <div className="letras-container">
                        
                        <div className="contenedor-botones">
                            <Button
                                className="Btn1"
                                text="PEDIR LETRA"
                                icon={<IoIosSend />}
                                disabled={!esMiTurno}
                                onClick={()=>pedirLetra(letraSeleccionada)}
                            />


                           <input
                                type="text"
                                value={respuesta}
                                onChange={(e)=>setRespuesta(e.target.value.toUpperCase())}
                                placeholder="Escribe la palabra"
                            />


                            <Button
                                className="Btn7"
                                text="ADIVINAR PALABRA"
                                disabled={!esMiTurno}
                                onClick={adivinarPalabra}
                            />


                        </div>

                        <h2>Elegi una letra</h2>
                        <div className="letras">

                            {
                                letras.map((letra)=>(
                                
                                    <Button
                                        key={letra}
                                        text={letra}
                                        disabled={!esMiTurno || letrasJugador.includes(letra)}
                                        className={`
                                            ${letraSeleccionada === letra ? "letra-seleccionada" : ""}
                                            ${letrasJugador.includes(letra) ? "letra-usada" : ""}
                                            ${letrasCorrectas.includes(letra) ? "letra-correcta" : ""}
                                        `}
                                        onClick={()=>setLetraSeleccionada(letra)}
                                    />
                                        
                                ))
                            }

                        </div>

                        
                    </div>

                </div>



                <div>
                    <div>
                        <FaListAlt /> <span>PALABRAS</span> 
                        <p>Adivina las 5 palabras de tu amigo</p>
                    </div>

                    <div className="palabra-container">

                        {
                        palabrasMostradas.map((item)=>(
                        
                        <div 
                        key={item.numero}
                        className="palabra1-container"
                        >
                        
                        <div className="palabra1">
                        
                        <span>
                        {item.numero}
                        </span>
                        
                        
                        <p>
                        {
                        item.completada
                        ?
                        item.palabra
                        :
                        "_ _ _ _ _"
                        }
                        </p>

                        </div>

                        </div>

                        ))

                        }

                    </div>

                    <hr></hr>
                
                    <div className="loguito-container">
                        <div>
                            <FaLightbulb className="icono-loguito"/>
                        </div>
                        <div>
                            <p className="loguito-texto">Las palabras pueden ser de cualquier tema</p>
                        </div>
                    </div>
                </div>

                
                


                
            </div>
    




        </>
    )
}


export default Juego;