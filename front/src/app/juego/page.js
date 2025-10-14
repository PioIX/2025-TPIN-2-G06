"use client";
import MenuPelea from "@/components/MenuPelea";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Personaje from "@/components/Personaje";
import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";

export default function Home() {
  const searchParams = useSearchParams();
  const [personaje, setPersonaje] = useState(null);
  const [personajeRival, setPersonajeRival] = useState(null);
  const [idPersonaje, setIdPersonaje] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [idRoom, setIdRoom] = useState(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("infoUser", (data) => {
      console.log(data);
    });

  }, [socket]);

  useEffect(() => {
    const paramId = searchParams.get("personaje");
    const paramIdUsuario = searchParams.get("idUsuario");
    const paramIdRoom = searchParams.get("idRoom");

    console.log("Parámetros:", { paramId, paramIdUsuario, paramIdRoom });

    setIdPersonaje(paramId);
    setIdUsuario(paramIdUsuario);
    setIdRoom(paramIdRoom);

    if (paramId && paramIdUsuario && paramIdRoom) {
      encontrarP();
    }
  }, [searchParams]);


  async function encontrarP() {
    console.log("Hola");
    try {
      const response = await fetch('http://localhost:4000/encontrarPersonaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idHabilidad: idPersonaje })
      });

      const data = await response.json();

      if (data.res) {
        setPersonaje(data.res);
        socket.emit("joinRoom", { room: idRoom, idPersonaje: personaje, idUsuario: idUsuario });
      }
    } catch (error) {
      console.error(error);
    }
  }


  function cambiarVida() {
    const nuevaVida = personaje.saludActual - 10;
    setPersonaje({
      ...personaje,
      saludActual: nuevaVida
    });
  }

  return (
    <main className="contenedor">

      {personaje && personajeRival ? (
        <div>
          {personaje.energiaActual}
          <Personaje nombre={personaje.nombre} imagen={personaje.fotoPersonaje} saludMax={personaje.saludMax} saludActual={personaje.saludActual} energiaMax={personaje.energiaMax} energiaActual={personaje.energiaActual}></Personaje>
          <Personaje nombre={personajeRival.nombre} imagen={personajeRival.fotoPersonaje} saludMax={personajeRival.saludMax} saludActual={personajeRival.saludActual} energiaMax={personajeRival.energiaMax} energiaActual={personajeRival.energiaActual}></Personaje>
          <div className="menu">
            <MenuPelea
              ataques={personaje.habilidades}
              probabilidadEsquivar={personaje.velocidad}
            />
          </div>
        </div>


      ) : (
        <div>
          <p>El id de la sala es: {searchParams.get("idRoom")}</p>
          <p>Cargando personaje...</p>
        </div>
      )}
      <Button onClick={cambiarVida} text={"Cambiar vida"}></Button>
    </main>
  );
}
