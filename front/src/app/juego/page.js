"use client";
import MenuPelea from "@/components/MenuPelea";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Personaje from "@/components/Personaje";
import styles from "./juego.module.css";
import { useSocket } from "@/hooks/useSocket";

export default function Home() {
  const searchParams = useSearchParams();
  const [personaje, setPersonaje] = useState(null);
  const [idPersonajeRival, setidPersonajeRival] = useState(null);
  const [personajeRival, setPersonajeRival] = useState(null);
  const [idPersonaje, setIdPersonaje] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [idRoom, setIdRoom] = useState(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;


  }, [socket]);

  /**
   * ==================
   * RECIBIR PARAMETROS 
   * ==================
   * */

  useEffect(() => {
    const paramId = searchParams.get("personaje");
    const paramIdUsuario = searchParams.get("idUsuario");
    const paramIdRoom = searchParams.get("idRoom");

    setIdPersonaje(paramId);
    setIdUsuario(paramIdUsuario);
    setIdRoom(paramIdRoom);
  }, []);

  useEffect((
  ) => {
    if (idPersonaje && idRoom) {
      encontrarP(idPersonaje).then((res) => {//NO ENTIENDO BIEN ESTO
        setPersonaje(res);
      });
    }
  }, [idPersonaje, idRoom])

  useEffect((
  ) => {
    if (idUsuario && idRoom) {
      encontrarIdRival();
    }
  }, [idUsuario, idRoom])


  /*
  ====================================
  ENCONTRAR MI PERSONAJE Y EL DEL RIVAL
  ====================================*/

  async function encontrarP(id) {
    try {
      const response = await fetch('http://localhost:4000/encontrarPersonaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idHabilidad: id })
      });

      const data = await response.json();
      if (data.res) {
        console.log("Personaje encontrado:", data.res);
        return (data.res)
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function encontrarIdRival() {
    try {
      const response = await fetch("http://localhost:4000/obtenerPersonajeOtroJugador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idRoom: idRoom,
          idUsuario: idUsuario,
        }),
      });

      const data = await response.json();

      if (data.idPersonaje) {
        setidPersonajeRival(data.idPersonaje);
        const rival = await encontrarP(data.idPersonaje);
        setPersonajeRival(rival);
        console.log("ID Personaje Rival:", data.idPersonaje);
      }
    } catch (err) {
      console.error(err);
    }
  }




  return (
    <main className="contenedor">

      {personaje && personajeRival ? (
        <div>
          <Personaje
            className="personajePropio"
            nombre={personaje.nombre}
            imagen={personaje.fotoPersonaje}
            saludMax={personaje.saludMax}
            saludActual={personaje.saludActual}
            energiaMax={personaje.energiaMax}
            energiaActual={personaje.energiaActual}
          />

          <Personaje
            className="personajeRival"
            nombre={personajeRival.nombre}
            imagen={personajeRival.fotoPersonaje}
            saludMax={personajeRival.saludMax}
            saludActual={personajeRival.saludActual}
            energiaMax={personajeRival.energiaMax}
            energiaActual={personajeRival.energiaActual}
          />
          <div className="menu">
            <MenuPelea
              ataques={personaje.habilidades}
              probabilidadEsquivar={personaje.velocidad}
            />
          </div>
        </div>


      ) : (
        <div className={styles.roomInfoContainer}>
          <p>El id de la sala es: {searchParams.get("idRoom")}</p>
          <p>Cargando personaje...</p>
        </div>
      )}
    </main>
  );
}
