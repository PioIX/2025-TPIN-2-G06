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
  const [numeroTurno, setNumeroTurno] = useState(0);
  const [mensajeError, setMensajeError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [barraProgreso, setBarraProgreso] = useState(0);
  const [avisitoFlag, setAvisitoFlag] = useState(false);
  const [personajesFlag, setPersonajesFlag] = useState(false);
  const [dataRival, setDataRival] = useState({});
  const [yoEsquivo, setYoesquivo] = useState(false);
  const [otroEsquiva, setOtroesquiva] = useState(false);
  
  // Estados para efectos visuales
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [tipoNotificacion, setTipoNotificacion] = useState("");
  const [flashRojo, setFlashRojo] = useState({ yo: false, rival: false });
  const [numerosFlotantes, setNumerosFlotantes] = useState([]);

  useEffect(() => {
    if (!socket) return;
    if (!idRoom) return;

    socket.emit("joinRoom", { room: idRoom });
    let habRivalTemp = {};
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

        if (data.daño != undefined && data.nombreHabilidad != undefined) {
          habRivalTemp = {
            daño: data.daño,
            nombreHabilidad: data.nombreHabilidad
          };
          setHabRival(habRivalTemp);
          if (data.esquiva != undefined) {
            console.log(data.esquiva);
            setOtroesquiva(data.esquiva);
          }
        } else {
          console.error('Datos inválidos para habRival:', data);
        }

        if (data.numeroTurno == 1) {
          setNumeroTurno(0);
          setDataRival(data);
          setPersonajesFlag(true);
          socket.emit("avisar", { data: idUsuario });
        }
      }
    });

    socket.on("avisito", (data) => {
      if (data.idUsuario !== idUsuario) {
        setAvisitoFlag(true);
      }
    });

    socket.on("ganadorAviso", (data) => {
      console.log(idUsuario);
      console.log(data.idUsuario);
      if (data.idUsuario !== idUsuario) {
        console.log("Ganaste");
      } else {
        console.log("Perdiste");
      }
    });
  }, [socket]);

  useEffect(() => {
    console.log(habRival);
    if (avisitoFlag) {
      if (habRival != undefined) {
        restarVida(habRival.daño);
      } else {
        console.log("No encuentra habilidad rival");
      }
      setAvisitoFlag(false);
    }
  }, [avisitoFlag]);

  useEffect(() => {
    if (personajesFlag) {
      if (personaje != undefined && personajeRival != undefined) {
        restarVida(dataRival.daño);
      } else {
        console.log("No encuentra habilidad rival");
      }
      setPersonajesFlag(false);
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
        socket.emit("ganador", { idUsuario: idUsuario });
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
        return (data.res);
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
    if (event.atacar == true) {
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
    } else if (event.defensa == true) {
      setHabElegida({
        daño: 0,
        nombreHabilidad: "Defensa"
      });
      setEmpieza(false);
      const probabilidadAleatoria = Math.floor(Math.random() * 100) + 1;
      console.log(`Probabilidad Aleatoria: ${probabilidadAleatoria}`);
      if (probabilidadAleatoria <= personajeRival.velocidad) {
        setYoesquivo(true);
        setPersonaje(prevPersonaje => ({
          ...prevPersonaje,
          energiaActual: prevPersonaje.energiaActual + 20,
        }));
      } else { 
        setYoesquivo(false);
      }
      socket.emit("cambiarTurno", { idUsuario: idUsuario, numeroTurno: numeroTurno, daño: 0, nombreHabilidad: "Defensa", esquiva: probabilidadAleatoria });
    }
  }

  function agregarNumeroFlotante(daño, esRival) {
    const id = Date.now() + Math.random();
    const nuevo = {
      id,
      daño: Math.round(daño),
      esRival
    };
    
    setNumerosFlotantes(prev => [...prev, nuevo]);
    
    setTimeout(() => {
      setNumerosFlotantes(prev => prev.filter(n => n.id !== id));
    }, 2000);
  }

  function mostrarNotificacionCombate(mensaje, tipo) {
    setMensajeNotificacion(mensaje);
    setTipoNotificacion(tipo);
    setMostrarNotificacion(true);

    setTimeout(() => {
      setMostrarNotificacion(false);
    }, 3500);
  }

  function restarVida(daño) {
    let dañoRival = 0;
    let dañoPersonaje = daño;
    let mensaje = "";
    let tipo = "";

    console.log(personaje.fuerza);
    console.log(personajeRival.fuerza);

    // Ambos atacan
    if (daño > 0 && habElegida.daño > 0) {
      daño = daño * personaje.fuerza / 100 * 0.75;
      dañoRival = habElegida.daño * personajeRival.fuerza / 100 * 0.75;
      mensaje = `⚔️ ¡Intercambio de golpes!`;
      tipo = "ataque";
    }

    // Ambos defienden
    if (daño === 0 && habElegida.daño === 0) {
      console.log("Ambos personajes han defendido, no reciben daño");
      mensaje = "🛡️ ¡Ambos se defienden!\nNinguno recibe daño";
      tipo = "defensa";
      mostrarNotificacionCombate(mensaje, tipo);
      return;
    }

    // Rival defiende, yo ataco
    if (daño === 0 && habElegida.daño > 0) {
      if (yoEsquivo) {
        console.log("El rival defendió y esquivó");
        dañoRival = 0;
        mensaje = `🛡️ ¡${personajeRival.nombre} esquivó!`;
        tipo = "esquiva";
      } else {
        console.log("El rival no defendió");
        dañoRival = habElegida.daño * personajeRival.fuerza / 100 * 0.75;
        mensaje = `⚔️ ¡Haz impactado con tu ataque`;
        tipo = "ataque";
      }
    }

    // Yo defiendo, rival ataca
    if (daño > 0 && habElegida.daño === 0) {
      if (otroEsquiva) {
        console.log("Yo defendí y esquivé");
        daño = 0;
        mensaje = `🛡️ ¡Esquivaste!\n${habRival.nombreHabilidad} no te alcanzó`;
        tipo = "esquiva";
      } else {
        console.log("No defendí");
        daño = daño * personaje.fuerza / 100 * 0.75;
        mensaje = `💥 ¡Te golpearon con ${habRival.nombreHabilidad}!\nNo pudiste esquivar`;
        tipo = "golpe";
      }
    }

    // Aplicar efectos visuales
    if (daño > 0) {
      setFlashRojo(prev => ({ ...prev, yo: true }));
      agregarNumeroFlotante(daño, false);
      setTimeout(() => setFlashRojo(prev => ({ ...prev, yo: false })), 500);
    }

    if (dañoRival > 0) {
      setFlashRojo(prev => ({ ...prev, rival: true }));
      agregarNumeroFlotante(dañoRival, true);
      setTimeout(() => setFlashRojo(prev => ({ ...prev, rival: false })), 500);
    }

    // Aplicar daño
    setPersonaje(prevPersonaje => ({
      ...prevPersonaje,
      saludActual: prevPersonaje.saludActual - daño,
    }));

    setPersonajeRival(prevPersonajeRival => ({
      ...prevPersonajeRival,
      saludActual: prevPersonajeRival.saludActual - dañoRival,
    }));

    // Mostrar notificación
    mostrarNotificacionCombate(mensaje, tipo);
  }

  return (
    <main className="contenedor">``
      {personaje && personajeRival ? (
        <div>
          <div className={flashRojo.yo ? 'flash-rojo' : ''}>
            <Personaje
              className="personajePropio"
              nombre={personaje.nombre}
              imagen={personaje.fotoPersonaje}
              saludMax={personaje.saludMax}
              saludActual={personaje.saludActual}
              energiaMax={personaje.energiaMax}
              energiaActual={personaje.energiaActual}
            />
          </div>

          <div className={flashRojo.rival ? 'flash-rojo' : ''}>
            <Personaje
              className="personajeRival"
              nombre={personajeRival.nombre}
              imagen={personajeRival.fotoPersonaje}
              saludMax={personajeRival.saludMax}
              saludActual={personajeRival.saludActual}
            />
          </div>

          {/* Números flotantes */}
          {numerosFlotantes.map(num => (
            <div
              key={num.id}
              className="numero-flotante"
              style={{
                left: num.esRival ? '75%' : '25%',
                top: '40%'
              }}
            >
              -{num.daño}
            </div>
          ))}

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
          <div className="bar-container">
            <div className="bar" style={{ width: `${barraProgreso}%` }}></div>
          </div>
        </div>
      )}

      {/* Notificación de Combate */}
      {mostrarNotificacion && (
        <div className={`notificacion-combate ${tipoNotificacion}`}>
          <div className="notificacion-mensaje">{mensajeNotificacion}</div>
        </div>
      )}
    </main>
  );
}