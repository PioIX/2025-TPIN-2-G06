"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import PersonajeLuqui from "@/components/PersonajeLuqui";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function ElegirPersonaje() {
  const [personajes, setPersonajes] = useState([]);
  const searchParams = useSearchParams();
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const router = useRouter();
  const [idUsuario, setIsUsuario] = useState(null);
  const [idPersonaje, setIdPersonaje] = useState(null)


  useEffect(() => {
    obtenerPersonajes();
    obtenerIdUsuario();
  }, []);

  const obtenerIdUsuario = () => {
    setIsUsuario(searchParams.get("idUsuario"));
  };

  async function obtenerPersonajes() {
    try {
      const response = await fetch("http://localhost:4000/obtenerPersonajes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setPersonajes(data);
    } catch (error) {
      console.error("Error al obtener los personajes:", error);
    }
  }

  const elegir = (e) => {
    const id = parseInt(e.target.value);
    setIdPersonaje(id);
    const personaje = personajes.find((p) => p.idPersonaje === id);
    setPersonajeSeleccionado(personaje);
    setMostrarModal(true);
  };


  const cancelar = () => {
    setMostrarModal(false);
    setPersonajeSeleccionado(null);
    setIdPersonaje(null)
  };

  const handleElegir = () => {
    // Podés guardar el personaje en localStorage si lo vas a usar después:
    console.log(idUsuario, idPersonaje)
    router.push(`/juego?idUsuario=${idUsuario}&personaje=${idPersonaje}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Seleccione un personaje:</h1>

      <select
        onChange={elegir}
        defaultValue=""
        style={{ padding: "10px", marginTop: "1rem" }}
      >
        <option value="" disabled>
          -- Elija un personaje --
        </option>
        {personajes.map((personaje) => (
          <option key={personaje.idPersonaje} value={personaje.idPersonaje}>
            {personaje.nombre}
          </option>
        ))}
      </select>

      {/* Modal */}
      {mostrarModal && personajeSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <PersonajeLuqui
              nombre={personajeSeleccionado.nombre}
              tipo={personajeSeleccionado.tipo}
              velocidad={personajeSeleccionado.velocidad}
              salud={personajeSeleccionado.salud}
              energia={personajeSeleccionado.energia}
              foto={personajeSeleccionado.foto}
            />
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "10px", justifyContent: "center" }}>
              <Button text="Cancelar" onClick={cancelar} />
              <Button text="Elegir" onClick={handleElegir} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
