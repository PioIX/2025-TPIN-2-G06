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
  const [id, setId] = useState(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("recibirDatosInicio", (data) => {
      console.log(data.id)
      if(data.id != id){
        console.log(data)
        setPersonajeRival(data.data)
      }
    });

  }, [socket]);

  useEffect(() => {
    const paramId = searchParams.get("id");
    setId(paramId);
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      encontrarP();
    }
  }, [id]);

  async function encontrarP() {
    try {
      const response = await fetch('http://localhost:4000/encontrarPersonaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idHabilidad: id })
      });

      const data = await response.json();

      if (data.res) {
        setPersonaje(data.res);
        socket.emit("entrarPartida",{room: searchParams.get("room"), data, id:id, personaje: personaje.id})
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
          <Personaje nombre={personaje.nombre} imagen={personaje.fotoPersonaje} saludMax={personaje.saludMax} saludActual={personaje.saludActual}></Personaje>
          <Personaje nombre={personajeRival.nombre} imagen={personajeRival.fotoPersonaje} saludMax={personajeRival.saludMax} saludActual={personajeRival.saludActual}></Personaje>
          {personajeRival.nombre}
          <div className="menu">
            <MenuPelea
              ataques={personaje.habilidades}
              probabilidadEsquivar={personaje.velocidad}
            />
          </div>
        </div>


      ) : (
        <p>Cargando personaje...</p>
      )}
      <Button onClick={cambiarVida} text={"Cambiar vida"}></Button>
    </main>
  );
}
