"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Asumiendo que usas Next.js
import Button from "@/components/Button";
import clsx from "clsx";
import Confetti from "react-confetti"; // Librería de confeti
import Fireworks from "fireworks-js"; // Librería para fuegos artificiales

export default function Chat() {
  const [chequeoGandor, setChequeoGanador] = useState(false);
  const [ganador, setGanador] = useState("gane");
  const router = useRouter();

  // Iniciar los fuegos artificiales cuando el estado del ganador cambie
  useEffect(() => {
    if (ganador === "gane") {
      const container = document.getElementById("fireworks-container");
      const fireworks = new Fireworks(container, {
        speed: 3,
        acceleration: 2,
        friction: 0.98,
        gravity: 1,
        particles: 200,
        explosion: 8,
      });
      fireworks.start();
    }
  }, [ganador]);

  return (
    <>
      <div
        className={clsx("resultado", {
          gane: ganador === "gane",
          perdiste: ganador === "perdiste",
          empate: ganador === "empate",
        })}
      >
        <div id="fireworks-container" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}></div>

        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={250} // Ajustar la cantidad de confeti
          gravity={0.2} // Gravedad de caída
          recycle={false} // No reciclar el confeti
        />

        {ganador === "gane" && (
          <div>
            <p className="victoria-text">¡Victoria Royal!</p>
            <Button text={"Volver"} onClick={() => router.replace(`/menuGeneral?idUsuario=${idUsuario}`)} />
          </div>
        )}
        {ganador === "perdiste" && (
          <div>
            <p>¡Tienes el culo roto!</p>
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
    </>
  );
}
