import { useState } from "react";

import { db } from "../../firebase/firebase"
import { collection, addDoc } from "firebase/firestore";

import NavBar from "../../components/NavBar/Navbar";

import "../1-Home/Home.css"

import Button from "../../components/Button"

import { FaPlus } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

import ImagenFondo from "../../assets/Fondo.png"
import Logo from "../../assets/Logo.png"

function Home() {

    const guardarPrueba = async () => {
        console.log("Se hizo click")
        await addDoc(
            collection(db, "pruebas"),
            {
                "codigo": "AB12CD",
                "estado": "esperando",
                "creadoEn": "...",

                "jugador1": {
                    "nombre": "Federico",
                    "puntos": 0,
                },

                "jugador2": null
            }
        )
    };


    const [mostrarCards, setMostrarCards] = useState(false);


    return (
        <>
            <div className="NavBar-container">
                <NavBar />
                <img className="logo" src={Logo} alt="Logo iniciales" />
                <div className="iniciar"></div>
            </div>

            <div className="titulo-container">
                <h1 className="titulo-home">Descubre la palabra por sus <span className="span">iniciales</span></h1>
                <p className="subtitulo-home"> Un juego de palabras, estrategia y asosiación para desafiar tu mente. !Juega con amigos en tiempo real! </p>
            </div>

            <div className="boton-container">
                <Button className={"Btn1"} icon={<FaPlus/>} text="CREAR SALA" to="/crear-sala
                "/>
                <Button className={"Btn1"} icon={<MdPeopleAlt />} text="UNIRSE A SALA" to="ingresar-sala"/>
            </div>

            <img className="imagen-fondo" src={ImagenFondo}></img>

            <div className="reglas-container">
                <h2 className="reglas-titulo">¿Como se juega ?</h2>

                <details className="reglas">
                    <summary>1. Escribe 5 palabras</summary>
                    <p>Un jugador escribe 5 palabras relacionadas entre si.</p>
                </details>

                <details className="reglas">
                    <summary>2. Se muestran las iniciales</summary>
                    <p>La primera palabra se muestra completa y las otras 4 por su inicial.</p>
                </details>

                <details className="reglas">
                    <summary>3. Pide una letra</summary>
                    <p>El rival elige una palabra y pide una letra para revelar su posición.</p>
                </details>

                <details className="reglas">
                    <summary>4. Adivina la palabra</summary>
                    <p>Si adivina la palabra completa, suma puntos y sigue su turno.</p>
                </details>

                <details className="reglas">
                    <summary>5. Gana el mejor</summary>
                    <p>El jugador con mas puntos al final de la partida gana.</p>
                </details>
            </div>    
                

            <div className="caracteristicas-container">
                <Button className={"Btn3"} icon={<HiAdjustmentsHorizontal />} text="CARACTERISTICAS" onClick={() => setMostrarCards(!mostrarCards)}/>

               {mostrarCards && (
                <div className="cards-container">
                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Tiempo Real</span>
                        <p>Juega en tiempo real con tus amigos.</p>
                    </div>

                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Desafia tu mente</span>
                        <p>Pon a prueba tu logica y asosiacion.</p>  
                    </div>

                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Juega con amigos</span>
                        <p>Crea salas privadas y juega con quien quieras.</p> 
                    </div>

                    <div className="card">
                        <HiAdjustmentsHorizontal className="icono"/>
                        <span>Compite y sube</span>
                        <p>Suma puntos y escala en el ranking global.</p> 
                    </div>
                </div>
                                   
                )}
            </div>
            

        </>
    )
}

export default Home;