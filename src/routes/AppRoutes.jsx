import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/1-Home/Home"
import CrearSala from "../pages/2-CreateRoom/CreateRoom";
import IngresarSala from "../pages/3-JoinRoom/JoinRoom"
import SalaEspera from "../pages/4-WaitingRoom/WaitingRoom";
import CrearPalabra from "../pages/5-CreateWords/CreateWords"
import Juego from "../pages/6-Game/Game";
import Resultado from "../pages/7-Result/Result";

export default function AppRoutes() {
    return (
        <BrowserRouter basename="/JuegoPalabras">
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/crear-sala" element={<CrearSala />} />

                <Route path="/ingresar-sala" element={<IngresarSala />} />

                <Route 
                    path="/espera/:codigo" 
                    element={<SalaEspera />} 
                />

                <Route 
                    path="/crear-palabra/:codigo" 
                    element={<CrearPalabra />} 
                />

                <Route 
                    path="/juego/:codigo" 
                    element={<Juego />} 
                />

                <Route 
                    path="/resultado/:codigo"
                    element={<Resultado />}
                />
                
            </Routes>
        </BrowserRouter>
    );
}