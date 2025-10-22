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
  const [idPersonajeRival, setIdPersonajeRival] = useState(null);
  const [personajeRival, setPersonajeRival] = useState(null);
  const [idPersonaje, setIdPersonaje] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [idRoom, setIdRoom] = useState(null);
  const { socket, isConnected } = useSocket();
  const [empieza, setEmpieza] = useState(false);
  const [habElegida, setHabElegida] = useState();
  const [habRival, setHabRival] = useState();
  const [numeroTurno, setNumeroTurno] = useState(0)
  const [mensajeError, setMensajeError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [barraProgreso, setBarraProgreso] = useState(0); // Estado para la barra de progreso
  const [avisitoFlag, setAvisitoFlag] = useState(false);
  const [personajesFlag, setPersonajesFlag] = useState(false);
  const [dataRival, setDataRival] = useState({})

  useEffect(() => {
    if (!socket) return;
    if (!idRoom) return;

    socket.emit("joinRoom", { room: idRoom });
    let habRivalTemp = {}
    const empiezaParam = searchParams.get("empieza");
    setEmpieza(empiezaParam === "true");

    socket.emit("sendMessage", { message: "UNIDO" });

    socket.on("newMessage", (data) => {
      encontrarIdRival();
    });

    socket.on("validarCambioTurno", (data) => {
      if (data.idUsuario !== idUsuario) {
        setEmpieza(true);
        setNumeroTurno(data.numeroTurno + 1);

        if (data.daño && data.nombreHabilidad) {
          habRivalTemp = {
            daño: data.daño,
            nombreHabilidad: data.nombreHabilidad
          }
          setHabRival(habRivalTemp);
        } else {
          console.error('Datos inválidos para habRival:', data);
        }

        if (data.numeroTurno == 1) {
          setNumeroTurno(0);
          setDataRival(data)
          setPersonajesFlag(true)
          socket.emit("avisar", { data: idUsuario });
        }
      }
    });

    socket.on("avisito", (data) => {
      if (data.idUsuario !== idUsuario) {
        setAvisitoFlag(true)
      }
    });

    socket.on("ganadorAviso", (data) => {
      console.log(idUsuario)
      console.log(data.idUsuario)
      if (data.idUsuario !== idUsuario) {
        console.log("Ganaste")
      }else{
        console.log("Perdiste")
      }
    });
  }, [socket]);

  useEffect(() => {
    console.log(habRival)
    if (avisitoFlag) {
      if (habRival != undefined) {
        restarVida(habRival.daño)
      } else {
        console.log("No encuentra habilidad rival")
      }
      setAvisitoFlag(false)
    }
  }, [avisitoFlag]);

  useEffect(() => {
    
    if (personajesFlag) {
      if (personaje != undefined && personajeRival !=undefined) {
        restarVida(dataRival.daño)
      } else {
        console.log("No encuentra habilidad rival")
      }
      setPersonajesFlag(false)
    }
  }, [personajesFlag]);

  useEffect(() => {
    const paramId = searchParams.get("personaje");
    const paramIdUsuario = searchParams.get("idUsuario");
    const paramIdRoom = searchParams.get("idRoom");

    setIdPersonaje(paramId);
    setIdUsuario(paramIdUsuario);
    setIdRoom(paramIdRoom);
  }, [searchParams]);

  useEffect(() => {
    if (personaje) {
      if (personaje.saludActual <= 0) {
        socket.emit("ganador", { idUsuario: idUsuario })
      }
    }
  }, [personaje]);

  useEffect(() => {
    if (idPersonaje && idRoom) {
      encontrarP(idPersonaje).then((res) => {
        setPersonaje(res);
      });
    }
  }, [idPersonaje, idRoom]);

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
    console.log("XD");
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
        setIdPersonajeRival(data.idPersonaje);
        const rival = await encontrarP(data.idPersonaje);
        setPersonajeRival(rival);
        console.log("ID Personaje Rival:", data.idPersonaje);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function ejecutarHabilidad(event) {
    console.log(event.ataque.daño);
    setHabElegida(event.ataque);

    if (personaje.energiaActual >= event.ataque.consumo) {
      setPersonaje(prevPersonaje => ({
        ...prevPersonaje,
        energiaActual: prevPersonaje.energiaActual - event.ataque.consumo,
      }));
      setMensajeError(null);
      setEmpieza(false);
      socket.emit("cambiarTurno", { idUsuario: idUsuario, numeroTurno: numeroTurno, daño: event.ataque.daño, nombreHabilidad: event.ataque.nombre });
    } else {
      setMensajeError("No tienes suficiente energía.");
      setMostrarModal(true);

      setBarraProgreso(0);

      const interval = setInterval(() => {
        setBarraProgreso((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return oldProgress + 5;
        });
      }, 100);

      setTimeout(() => {
        setMostrarModal(false);
      }, 2000);
    }
    
  }

  function restarVida(daño) {
    let dañoRival = 0
    if(personaje.tipo == personajeRival.tipo){
      daño = daño * personaje.fuerza /100 * 0.5
      dañoRival = habElegida.daño * personajeRival.fuerza /100 * 0.5
    }else{
      daño = daño * personaje.fuerza /100 * 0.75          
      dañoRival = habElegida.daño * personajeRival.fuerza /100 * 0.75
    }
    setPersonaje(prevPersonaje => ({
      ...prevPersonaje,
      saludActual: prevPersonaje.saludActual - daño,
    }));
    setPersonajeRival(prevPersonajeRival => ({
      ...prevPersonajeRival,
      saludActual: prevPersonajeRival.saludActual - dañoRival,
    }))
    
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
          />

          <div className="menu">
            <MenuPelea
              empieza={empieza}
              ataques={personaje.habilidades}
              probabilidadEsquivar={personaje.velocidad}
              onClick={ejecutarHabilidad}
            />
          </div>
        </div>
      ) : (
        <div className={styles.roomInfoContainer}>
          <p>El id de la sala es: {searchParams.get("idRoom")}</p>
          <p>Cargando personaje...</p>
        </div>
      )}

      {/* Modal de Energía Insuficiente */}
      {mensajeError && mostrarModal && (
        <div className="modalERROR">
          <p>{mensajeError}</p>

          {/* Barra de carga */}
          <div className="bar-container">
            <div className="bar" style={{ width: `${barraProgreso}%` }}></div>
          </div>
        </div>
      )}

    </main>
  );
}