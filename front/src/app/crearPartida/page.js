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
        router.replace(`/juego?idRoom=${roomFinal}&personaje=${personaje}`);
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
    </>
  );
}
