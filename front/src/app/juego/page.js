"use client";
import MenuPelea from "@/components/MenuPelea";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Personaje from "@/components/Personaje";
import styles from "./juego.module.css";
import { useSocket } from "@/hooks/useSocket";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import clsx from 'clsx';




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
  const [chequeoGandor, setChequeoGanador] = useState(false)
  const [ganador, setGanador] = useState("")
  const router = useRouter();

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
            nombreHabilidad: data.nombreHabilidad,
            esquiva: data.esquiva !== undefined ? data.esquiva : null
          };
          setHabRival(habRivalTemp);
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
        setChequeoGanador(true)
        setGanador("gane")
        actualizarSalas()
      } else {
        setChequeoGanador(true)
        if (ganador == "gane") {
          setGanador("empate")
        } else {
          console.log("Perdiste");
          setGanador("perdiste")
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    console.log(habRival);
    if (avisitoFlag) {
      if (habRival != undefined) {
        restarVida(habRival);
      } else {
        console.log("No encuentra habilidad rival");
      }
      setAvisitoFlag(false);
    }
  }, [avisitoFlag]);

  useEffect(() => {
    if (personajesFlag) {
      if (personaje != undefined && personajeRival != undefined) {
        restarVida(dataRival);
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
        socket.emit("cambiarTurno", {
          idUsuario: idUsuario,
          numeroTurno: numeroTurno,
          daño: event.ataque.daño,
          nombreHabilidad: event.ataque.nombre
        });
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
      const probabilidadAleatoria = Math.floor(Math.random() * 100) + 1;
      console.log(`Probabilidad Aleatoria Defensa: ${probabilidadAleatoria}`);

      setHabElegida({
        daño: 0,
        nombreHabilidad: "Defensa",
        esquiva: probabilidadAleatoria
      });

      setEmpieza(false);

      setPersonaje(prevPersonaje => ({
        ...prevPersonaje,
        energiaActual: prevPersonaje.energiaActual + 20,
      }));

      socket.emit("cambiarTurno", {
        idUsuario: idUsuario,
        numeroTurno: numeroTurno,
        daño: 0,
        nombreHabilidad: "Defensa",
        esquiva: probabilidadAleatoria
      });
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
    }, 2000);
  }

  function restarVida(accionRival) {
    const dañoRivalRecibido = accionRival.daño;
    const esquivaRival = accionRival.esquiva;

    let dañoAplicadoARival = 0;
    let dañoAplicadoAMi = 0;
    let mensaje = "";
    let tipo = "";

    console.log("=== INICIO CÁLCULO DAÑO ===");
    console.log("Acción Rival:", accionRival);
    console.log("Acción Mía (habElegida):", habElegida);

    // Ambos atacan
    if (dañoRivalRecibido > 0 && habElegida.daño > 0) {
      dañoAplicadoAMi = dañoRivalRecibido * personaje.fuerza / 100 * 0.75;
      dañoAplicadoARival = habElegida.daño * personajeRival.fuerza / 100 * 0.75;
      mensaje = `⚔️ ¡Intercambio de golpes!`;
      tipo = "ataque";
    }

    // Ambos defienden
    else if (dañoRivalRecibido === 0 && habElegida.daño === 0) {
      console.log("Ambos personajes han defendido, no reciben daño");
      mensaje = "🛡️ ¡Ambos se defienden!\nNinguno recibe daño";
      tipo = "defensa";
      mostrarNotificacionCombate(mensaje, tipo);
      return;
    }

    // Yo ataco, rival defiende
    else if (dañoRivalRecibido === 0 && habElegida.daño > 0) {
      console.log("Yo ataco, rival defiende");
      console.log("Esquiva rival:", esquivaRival);
      console.log("Mi velocidad:", personajeRival.velocidad);

      // El rival esquiva si su número aleatorio es menor o igual a mi velocidad
      if (esquivaRival !== null && esquivaRival <= personajeRival.velocidad) {
        console.log("El rival esquivó mi ataque");
        dañoAplicadoARival = 0;
        mensaje = `🛡️ ¡${personajeRival.nombre} esquivó tu ataque!`;
        tipo = "esquiva";
      } else {
        console.log("El rival no esquivó, recibe daño");
        dañoAplicadoARival = habElegida.daño * personajeRival.fuerza / 100 * 0.75;
        mensaje = `⚔️ ¡Has impactado tu ataque!`;
        tipo = "ataque";
      }
    }

    // Rival ataca, yo defiendo
    else if (dañoRivalRecibido > 0 && habElegida.daño === 0) {
      console.log("Rival ataca, yo defiendo");
      console.log("Mi esquiva:", habElegida.esquiva);
      console.log("Velocidad del personaje:", personaje.velocidad);

      // Yo esquivo si mi número aleatorio es menor o igual a mi velocidad
      if (habElegida.esquiva !== null && habElegida.esquiva <= personaje.velocidad) {
        console.log("Yo esquivé el ataque");
        dañoAplicadoAMi = 0;
        mensaje = `🛡️ ¡Esquivaste!\n${accionRival.nombreHabilidad} no te alcanzó`;
        tipo = "esquiva";
      } else {
        console.log("No esquivé, recibo daño");
        dañoAplicadoAMi = dañoRivalRecibido * personaje.fuerza / 100 * 0.75;
        mensaje = `💥 ¡Te golpearon con ${accionRival.nombreHabilidad}!\nNo pudiste esquivar`;
        tipo = "golpe";
      }
    }

    console.log("Daño aplicado a mí:", dañoAplicadoAMi);
    console.log("Daño aplicado al rival:", dañoAplicadoARival);
    console.log("=== FIN CÁLCULO DAÑO ===");

    // Aplicar efectos visuales
    if (dañoAplicadoAMi > 0) {
      setFlashRojo(prev => ({ ...prev, yo: true }));
      agregarNumeroFlotante(dañoAplicadoAMi, false);
      setTimeout(() => setFlashRojo(prev => ({ ...prev, yo: false })), 500);
    }

    if (dañoAplicadoARival > 0) {
      setFlashRojo(prev => ({ ...prev, rival: true }));
      agregarNumeroFlotante(dañoAplicadoARival, true);
      setTimeout(() => setFlashRojo(prev => ({ ...prev, rival: false })), 500);
    }

    // Aplicar daño
    setPersonaje(prevPersonaje => ({
      ...prevPersonaje,
      saludActual: Math.round(prevPersonaje.saludActual - dañoAplicadoAMi),
    }));

    setPersonajeRival(prevPersonajeRival => ({
      ...prevPersonajeRival,
      saludActual: Math.round(prevPersonajeRival.saludActual - dañoAplicadoARival),
    }));


    // Mostrar notificación
    mostrarNotificacionCombate(mensaje, tipo);
  }

  async function actualizarSalas() {
    try {
      const response = await fetch("http://localhost:4000/actualizarSala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_room: idRoom,
          idGanador: idUsuario,
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

  return (
    <div
      className={clsx("contenedor", {
        "fondo-victoria": ganador === "gane",  // Fondo para victoria
        "fondo-derrota": ganador === "perdiste",  // Fondo para derrota
      })}
    >
      {personaje && personajeRival ? (
        !chequeoGandor ? (
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
          <div
            className={"resultado"}
          >
            {ganador === "gane" && (
              <div>
                <Button text={"Volver"} onClick={() => router.replace(`/menuGeneral?idUsuario=${idUsuario}`)} />
              </div>
            )}
            {ganador === "perdiste" && (
              <div>
                <Button text={"Volver"} onClick={() => router.replace(`/menuGeneral?idUsuario=${idUsuario}`)} />
              </div>
            )}
            {ganador === "empate" && (
              <div>
                <p>¡Han empatado!</p>
                <Button text={"Volver"} onClick={() => router.replace(`/menuGeneral?idUsuario=${idUsuario}`)} />
              </div>
            )}
          </div>
        )
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
    </div>



  )
}