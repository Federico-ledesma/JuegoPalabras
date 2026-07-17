import { useRef } from "react";

import "../Codigo/Codigo.css";


function Codigo({ codigo, setCodigo }) {

    const inputs = useRef([]);


    const handleChange = (e, index) => {

        const valor = e.target.value.toUpperCase();

        let nuevoCodigo = codigo.split("");

        nuevoCodigo[index] = valor;


        // Solo actualiza si existe setCodigo
        if(setCodigo){
            setCodigo(nuevoCodigo.join(""));
        }


        // pasa automáticamente al siguiente input
        if(valor && index < 5){
            inputs.current[index + 1].focus();
        }

    };


    const handleKeyDown = (e,index)=>{

        if(
            e.key === "Backspace" &&
            e.target.value === "" &&
            index > 0
        ){

            inputs.current[index - 1].focus();

        }

    };

    const handlePaste = (e) => {

    e.preventDefault();

    const texto = e.clipboardData
        .getData("text")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

    const nuevoCodigo = texto.split("");

    while (nuevoCodigo.length < 6) {
        nuevoCodigo.push("");
    }

    if (setCodigo) {
        setCodigo(nuevoCodigo.join(""));
    }

    const ultimo = Math.min(texto.length - 1, 5);

    if (ultimo >= 0) {
        inputs.current[ultimo].focus();
    }

};


    return (

        <div className="codigo">

            {
                [...Array(6)].map((_,index)=>(

                    <input

                        key={index}
                                    
                        ref={(el)=> inputs.current[index] = el}
                                    
                        type="text"
                                    
                        maxLength={1}
                                    
                        value={codigo[index] || ""}
                                    
                        onChange={(e)=>handleChange(e,index)}
                                    
                        onKeyDown={(e)=>handleKeyDown(e,index)}
                                    
                        onPaste={handlePaste}
                                    
                        readOnly={!setCodigo}
                                    
                    />

                ))
            }

        </div>

    );

}


export default Codigo;