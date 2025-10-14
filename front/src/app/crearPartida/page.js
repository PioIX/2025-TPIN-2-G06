"use client";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";


export default function Prueba() {
  const { socket } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hacer, setHacer] = useState("elegir");
  const [idRoom, setIdRoom] = useState("");
  const [idPersonaje, setIdPersonaje] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  useEffect(() => {
    const paramId = searchParams.get("personaje");
    const paramIdUsuario = searchParams.get("idUsuario");
    setIdPersonaje(paramId);
    setIdUsuario(paramIdUsuario);


  }, []);
  async function manejarPartida(tipo) {

    try {
      const res = await fetch("http://localhost:4000/entrarPartida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: idUsuario,
          roomId:idRoom,
          personaje: idPersonaje,
          tipo: tipo,
        }),
      });

      const data = await res.json();

      if (data.validar) {
        const roomFinal = data.roomId;
        setIdRoom(roomFinal);
        router.replace(`/juego?idRoom=${roomFinal}&personaje=${idPersonaje}`);
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
      {hacer == "elegir" && (
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
