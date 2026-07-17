import "./Tabla.css";

const TablaNaruto = ({ historial }) => {

    return (

        <table>

            <thead>
                <tr>
                    <th>PALABRA</th>
                    <th>AUTOR</th>
                    <th>ADIVINÓ</th>
                    <th>LETRAS</th>
                    <th>PUNTOS</th>
                </tr>
            </thead>

            <tbody>
            {
                historial.map((item,index)=>(
                
                    <tr key={index}>
                    
                        <td>
                            {index + 1}. {item.palabra}
                        </td>
                
                        <td>
                            @{item.autor}
                        </td>
                
                        <td>
                            @{item.adivinador}
                        </td>
                
                        <td>
                            {item.letrasPedidas}
                        </td>
                
                        <td>
                            {item.puntos}
                        </td>
                
                    </tr>

                ))
            }

        </tbody>

        </table>

    );

};

export default TablaNaruto;