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

const normalizarTexto = (texto) => {
    return texto
        .trim()
        .replace(/\s+/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
};

function Juego() {

    const navigate = useNavigate();

    const { codigo } = useParams();

    const [sala,setSala] = useState(null);

    const [letraSeleccionada, setLetraSeleccionada] = useState("");

    const nombreJugador = localStorage.getItem("nombreJugador");

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    const letras = [
        "A","B","C","D","E","F","G",
        "H","I","J","K","L","M",
        "N","Ñ","O","P","Q","R",
        "S","T","U","V","W",
        "X","Y","Z",""
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

    const palabraPrincipal = palabrasRival?.[0];

    const palabraActualNumero = progresoJugador + 1;

    const palabraActual = palabrasRival?.[palabraActualNumero];

    const letrasJugador =
    sala.letrasUsadas?.[jugadorActualID]?.[palabraActualNumero] || [];

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

    const pedirLetra = async () => {

        const salaRef = doc(
            db,
            "salas",
            codigo
        );

        const palabraActualNumero = progresoJugador + 1;

        const letrasActuales =
            sala.letrasUsadas?.[jugadorActualID]?.[palabraActualNumero] || [];

        const palabra = palabraActual.toUpperCase();

        // Buscar la siguiente letra que todavía no fue revelada
        let siguienteLetra = null;

        for (let i = 1; i < palabra.length; i++) {

            if (!letrasActuales.includes(palabra[i])) {

                siguienteLetra = palabra[i];
                break;

            }

        }

        // Ya no quedan letras por revelar
        if (!siguienteLetra) {
            return;
        }

        const nuevasLetras = [
            ...letrasActuales,
            siguienteLetra
        ];

        const siguienteTurno =
            sala.turno === "jugador1"
                ? "jugador2"
                : "jugador1";
            
        await updateDoc(salaRef, {
            [`letrasUsadas.${jugadorActualID}.${palabraActualNumero}`]:
                nuevasLetras,
        
            turno: siguienteTurno
        });

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
    if (
        normalizarTexto(respuesta) === normalizarTexto(palabraCorrecta)
    ) {


        const puntosGanados = Math.max(
            100 - (letrasJugador.length * 10),
            0
        );


        const puntosActuales = jugadorActual.puntos;


        const nuevoProgreso = progresoJugador + 1;


        const termino =
            nuevoProgreso >= 4;

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

                letrasUsadas: {
                    ...sala.letrasUsadas,
                    [jugadorActualID]: {
                        ...sala.letrasUsadas?.[jugadorActualID],
                        [palabraActualNumero]: []
                    }
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

        setLetraSeleccionada("");
        setRespuesta("");


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

        // Limpiar el input
        setRespuesta("");

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
        .map((letra, index) => {

            

            // En las demás, la primera letra siempre visible
            if (index === 0) {
                return letra;
            }

            // Las letras pedidas se muestran
            if (letrasJugador.includes(letra)) {
                return letra;
            }

            return "_";

        })
        .join(" ")
    : "";

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

    const palabrasPanel = palabrasRival?.map((palabra, index) => {

        // La palabra principal siempre visible
        if (index === 0) {
            return {
                texto: palabra,
                completada: false,
            };
        }

        // Si ya fue adivinada
        if (index <= progresoJugador) {
            return {
                texto: palabra,
                completada: true,
            };
        }

        // Si todavía no fue adivinada
        return {
            texto:
                palabra[0].toUpperCase() +
                " " +
                "_ ".repeat(palabra.length - 1),
            completada: false,
        };

    });

    const esLetraCorrecta = (letra) => {
        return (
            letrasJugador.includes(letra) &&
            palabraActual?.toUpperCase().includes(letra)
        );
    };

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
                        Palabra {progresoJugador + 2}/5
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

                        <h1 className="palabra-principal">
                            {palabraPrincipal?.toUpperCase()} 
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
                            <input
                                className="input-adivinar"
                                 type="text"
                                 value={respuesta}
                                 onChange={(e)=>setRespuesta(e.target.value.toUpperCase())}
                                 placeholder="Escribe la palabra"
                             />
                            
                            <div className="botones">
                                <Button
                                    className="Btn4"
                                    text="PEDIR LETRA"
                                    icon={<IoIosSend />}
                                    disabled={!esMiTurno}
                                    onClick={pedirLetra}
                                />

                                <Button
                                    className="Btn4"
                                    text="ADIVINAR PALABRA"
                                    disabled={!esMiTurno}
                                    onClick={adivinarPalabra}
                                />
                            </div>
                        </div>

                        
                    </div>

                </div>



                <div>
                    <div className="titulo-palabras-adivinar-container">
                        <h3 className="titulo-palabras-adivinar"><FaListAlt />PALABRAS</h3> 
                        <p className="subtitulo-palabras-adivinar">Adivina las 5 palabras de tu amigo</p>
                    </div>

                    <div className="palabra-container">

                        {
                            palabrasPanel.map((item, index) => (
                            
                                <div
                                    key={index}
                                    className="palabra1"
                                >

                            
                        


                                <p className="palabra1-adivinar">
                                    {item.texto.toUpperCase()}

                                    {
                                        item.completada &&
                                        " ✅"
                                    }
                                </p>


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