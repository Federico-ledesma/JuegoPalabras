import { db } from "../firebase/firebase"               //conexion con firebase
import { collection, doc } from "firebase/firestore"                //crea una referencia al documento
import { setDoc } from "firebase/firestore"             //crea o reemplaza un documento
import { getDoc } from "firebase/firestore"             // lee un documento
import { serverTimestamp } from "firebase/firestore"    // guarda la fecha y hora del sv en fb
import { addDoc } from "firebase/firestore"
import { query } from "firebase/firestore"
import { where } from "firebase/firestore"
import { getDocs } from "firebase/firestore"
import { updateDoc } from "firebase/firestore"

import {generateRoomCode} from "../utils/generateRoomCode"

export async function crearSala(nombreJugador) {
    
    let codigo;
    let salaExiste = true;


    // genera un codigo hasta encontrar uno que no exista

    while (salaExiste) {
        codigo = generateRoomCode()

        const salaRef = doc(db, "salas", codigo);

        const salaSnap = await getDoc(salaRef);

        salaExiste = salaSnap.exists();
    }

    // Referencia al documento de la sala

    const salaRef = doc(db, "salas", codigo);

    //Crear la Sala
    await setDoc(salaRef, {
        
        codigo: codigo,
        
        estado: "esperando",
        
        jugador1:{
            nombre:nombreJugador,
            puntos:0,
            listo:false
        },
    
        jugador2:null,
    
        turno:"jugador1",
    
        progreso:{
            jugador1:0,
            jugador2:0
        },
    
        palabras:{
            jugador1:[],
            jugador2:[]
        },
    
        letrasUsadas:{
            jugador1:[],
            jugador2:[]
        },
    
        ganador:null,
    
        creadoEn:serverTimestamp()
    
    });

return codigo;

} // <-- E


// Unirse a sala

export async function unirseSala(codigo, nombreJugador) {
    const salaRef = collection(db,"salas");


    const q = query(
        salaRef,
        where("codigo","==",codigo.toUpperCase())
    );

    const resultado = await getDocs(q);

    if(resultado.empty) {

        throw new Error("La sala no existe")

    }

    const sala = resultado.docs[0];

    const datos = sala.data();

    if(datos.jugador2){

        throw new Error("La sala ya está llena");

    }

    await updateDoc(
        doc(db,"salas",sala.id),

        {
            jugador2:{
                nombre:nombreJugador,
                puntos: 0,
                listo: false
            },

            estado: "esperando"
        }
    )

    return codigo.toUpperCase();

}



export async function guardarPalabras(codigo, nombreJugador, palabras) {

    const salaRef = doc(db, "salas", codigo);

    const salaSnap = await getDoc(salaRef);

    if (!salaSnap.exists()) {
        throw new Error("La sala no existe");
    }

    const datos = salaSnap.data();

    let campoJugador = "";

    if (datos.jugador1.nombre === nombreJugador) {
        campoJugador = "jugador1";
    } else {
        campoJugador = "jugador2";
    }

    await updateDoc(salaRef, {
        [`palabras.${campoJugador}`]: palabras,
        [`${campoJugador}.listo`]: true
    });

}