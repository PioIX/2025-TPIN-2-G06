"use client";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Prueba() {
  const { socket } = useSocket();
  const router = useRouter();

  const [hacer, setHacer] = useState("elegir");
  const [idRoom, setIdRoom] = useState("");
  const [personaje, setPersonaje] = useState(1);
  const [userId] = useState(Math.floor(Math.random() * 9000) + 1000);
  const [validar, setValidar] = useState(false);
  const [otroValidar, setOtroValidar] = useState(false);

  // 🔹 useEffect separado (NO dentro de manejarPartida)
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      console.log("📩 Mensaje recibido:", data);
      if (data.validar && data.userId !== userId) {
        setOtroValidar(true);
      }
    });

    return () => socket.off("newMessage");
  }, [socket, userId]);

  // 🔹 Si ambos validan, entra al juego
  useEffect(() => {
    if (validar && otroValidar && idRoom) {
      router.replace(`/juego?idRoom=${idRoom}&personaje=${personaje}`);
    }
  }, [validar, otroValidar, idRoom, personaje, router]);

  // 🔹 Función para crear o unirse
  async function manejarPartida(tipo) {
    try {
      const res = await fetch("http://localhost:4000/entrarPartida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          roomId: idRoom,
          personaje,
          tipo,
        }),
      });

      const data = await res.json();

      if (data.validar) {
        const roomFinal = data.roomId;
        setIdRoom(roomFinal);
        setHacer("enPartida");
        setValidar(true);

        // 🔹 Aviso por socket (no hay hooks acá)
        socket.emit("joinRoom", { room: roomFinal });
        socket.emit("sendMessage", { room: roomFinal, validar: true, userId });
      } else {
        alert(data.res);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error al conectar con el servidor");
    }
  }

  return (
    <>
      {hacer === "elegir" && (
        <div>
          <Button onClick={() => manejarPartida("crear")} text="Crear Partida" />
          <Button onClick={() => setHacer("unirse")} text="Unirse a Partida" />
        </div>
      )}

      {hacer === "unirse" && (
        <div>
          <Input
            placeholder="Coloca el id de la partida"
            onChange={(e) => setIdRoom(e.target.value)}
            value={idRoom}
          />
          <Button onClick={() => manejarPartida("unirse")} text="Unirse a Partida" />
          <Button onClick={() => setHacer("elegir")} text="Volver" />
        </div>
      )}

      {hacer === "enPartida" && (
        <div>
          <h2>🕹️ Estás en la sala {idRoom}</h2>
          <p>Esperando jugadores...</p>
        </div>
      )}
    </>
  );
}
