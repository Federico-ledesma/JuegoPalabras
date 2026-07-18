import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar/Navbar"
import Button from "../../components/Button";

import { guardarPalabras } from "../../services/roomService";

import "../5-CreateWords/CreateWords.css"

import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { FaTrophy } from "react-icons/fa";

import Logo from "../../assets/Logo.png"
function CrearPalabra() {

    const { codigo } = useParams();
    console.log("CODIGO RECIBIDO:", codigo);

    const navigate = useNavigate();

    const nombreJugador = localStorage.getItem("nombreJugador");

    const [mostrarCards, setMostrarCards] = useState(false);

    const [palabras, setPalabras] = useState([
        "",
        "",
        "",
        "",
        ""
    ]);

    const [esperando, setEsperando] = useState(false);

    const cambiarPalabra = (index, valor) => {
        const nuevasPalabras = [...palabras];

        nuevasPalabras[index] = valor;

        setPalabras(nuevasPalabras)
    }

    const guardar = async () => {

         console.log("Código:", codigo);
    console.log("Nombre:", nombreJugador);
    console.log("Palabras:", palabras);

        if (palabras.some(p => p.trim() === "")) {
            alert("Completa las 5 palabras");
            return;
        }

        try {

            const palabrasLimpias = palabras.map((palabra) =>
                palabra.trim().replace(/\s+/g, " ")
            );
    
            await guardarPalabras(
                codigo,
                nombreJugador,
                palabrasLimpias
            );

            setEsperando(true);

        } catch (error) {

            alert(error.message);

        }

    };


    useEffect(()=>{

    const salaRef = doc(
        db,
        "salas",
        codigo
    );

    const unsubscribe = onSnapshot(
        salaRef,
        (snapshot)=>{

            if(!snapshot.exists()) return;

            const datos = snapshot.data();

            if(
                datos.jugador1?.listo &&
                datos.jugador2?.listo
            ){

                navigate(`/juego/${codigo}`);

            }
        }
    );


    return ()=>unsubscribe();


},[codigo,navigate]);

    if(esperando){
        return(
            <div>
                <h1>Palabras guardadas ✅</h1>

                <p>
                    Esperando al otro jugador...
                </p>
            </div>
        )
    }

    return(
        <>

            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            {/*Linea temporal */}
            <div className="linea-temporal-container">

                <div className="linea-temporal">
                    <img className="logos" src={Logo} alt="Logo iniciales" />
                    <span>Sala</span>
                </div>
                <div className="linea"></div>

                <div className="linea-temporal">
                    <img className="logos" src={Logo} alt="Logo iniciales" />
                    <span>Jugadores</span>
                </div>
                <div className="linea"></div>

                <div className="linea-temporal">
                    <img className="logos" src={Logo} alt="Logo iniciales" />
                    <span>Palabras</span>
                </div>
                <div className="linea"></div>

                <div className="linea-temporal">
                    <img className="logos" src={Logo} alt="Logo iniciales" />
                    <span>Juego</span>
                </div>
                <div className="linea"></div>

            </div>

            {/*Titulo */}
                <div className="titulo-crear-container">
                    <img className="fondo-crear" src={Logo} alt="Logo iniciales" />
                    <h1 className="titulo-crear">CREA LAS <span className="span">5 PALABRAS</span></h1>
                </div>
                <p className="subtitulo-crear">Escribe 5 palabras relacionadas entre sí para que tu amigo adivine.</p>


            {/*Palabras */}
            <div className="palabras-container">
                <h2 className="span">
                    TUS PALABRAS (
                    {
                        palabras.filter(
                            palabra => palabra.trim() !== ""
                        ).length
                    }/5)
                </h2>

                <div className="palabras">
                    <h3 className="titulo-palabra">1</h3>

                    <input
                        type="text"
                        placeholder="Escribe la primera palabra"
                        className="palabra"
                        maxLength={20}
                        value={palabras[0]}
                        onChange={(e)=>cambiarPalabra(0,e.target.value)}
                    />

                </div>

                <div className="palabras">
                    <h3 className="titulo-palabra">2</h3>
                    <input
                        type="text"
                        placeholder="Escribe la segunda palabra"
                        className="palabra"
                        maxLength={20}
                        value={palabras[1]}
                        onChange={(e)=>cambiarPalabra(1,e.target.value)}
                    />
                </div>

                <div className="palabras">
                    <h3 className="titulo-palabra">3</h3>
                    <input
                        type="text"
                        placeholder="Escribe la tercera palabra"
                        className="palabra"
                        maxLength={20}
                        value={palabras[2]}
                        onChange={(e)=>cambiarPalabra(2,e.target.value)}
                    />
                </div>

                <div className="palabras">
                    <h3 className="titulo-palabra">4</h3>
                    <input
                        type="text"
                        placeholder="Escribe la cuarta palabra"
                        className="palabra"
                        maxLength={20}
                        value={palabras[3]}
                        onChange={(e)=>cambiarPalabra(3,e.target.value)}
                    />
                </div>

                <div className="palabras">
                    <h3 className="titulo-palabra">5</h3>
                    <input
                        type="text"
                        placeholder="Escribe la quinta palabra"
                        className="palabra"
                        maxLength={20}
                        value={palabras[4]}
                        onChange={(e)=>cambiarPalabra(4,e.target.value)}
                    />
                </div>

                <span className="regla"> <HiAdjustmentsHorizontal />Máximo 20 caracteres por palabra</span>
            </div>

            {/*consejos */}
            <div className="caracteristicas-container">
                <Button className={"Btn3"} icon={<HiAdjustmentsHorizontal />} text="CONSEJOS" onClick={() => setMostrarCards(!mostrarCards)}/>

               {mostrarCards && (
                <div className="cards-container">
                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Relacionadas</span>
                        <p>Elegí palabras que tengan algo en común.</p>
                    </div>

                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Ni muy difíciles</span>
                        <p>Evitá palabras imposibles, pero que desafíen.</p>  
                    </div>

                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Sé creativo</span>
                        <p>Usá temas que te gusten y conozcas bien.</p> 
                    </div>

                </div>
                                   
                )}
            </div>

            {/*loguito */}
            <div className="loguito-container">
                <div>
                    <FaTrophy className="icono-loguito"/>
                </div>
                <div>
                    <p className="loguito-texto"><span className="span">La calidad de tus palabras hace</span> el juego más divertido</p>
                </div>
            </div>
            
            {/*Comenzar juego */}
            <div className="boton-comenzar">
                <Button 
                className="Btn1" 
                text="CONFIRMAR PALABRAS" 
                icon={<HiAdjustmentsHorizontal/>}
                onClick={guardar}
                />
            </div>
        </>
    )
}

export default CrearPalabra