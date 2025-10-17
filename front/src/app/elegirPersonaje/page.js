"use client";
import styles from "./elegirPersonaje.module.css";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import PersonajeLuqui from "@/components/PersonajeLuqui";
import CardPersonaje from "@/components/CardPersonaje";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function ElegirPersonaje() {
  const [personajes, setPersonajes] = useState([]);
  const searchParams = useSearchParams();
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const router = useRouter();
  const [idUsuario, setIsUsuario] = useState(null);
  const [idPersonaje, setIdPersonaje] = useState(null);

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

  const elegir = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setIdPersonaje(personaje.idPersonaje);
    setMostrarModal(true);
  };

  const cancelar = () => {
    setMostrarModal(false);
    setPersonajeSeleccionado(null);
    setIdPersonaje(null);
  };

  const handleElegir = () => {
    router.push(`/crearPartida?idUsuario=${idUsuario}&personaje=${idPersonaje}`);
  };

  return (
    <div className={styles.elegirWrapper}>
      <h1 className={styles.elegirTitle}>Seleccioná tu personaje</h1>

      <div className={styles.gridPersonajes}>
        {personajes.map((personaje) => (
          <CardPersonaje
            key={personaje.idPersonaje}
            nombre={personaje.nombre}
            foto={personaje.foto}
            onClick={() => elegir(personaje)}
          />
        ))}
      </div>

      {mostrarModal && personajeSeleccionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <PersonajeLuqui
              nombre={personajeSeleccionado.nombre}
              tipo={personajeSeleccionado.tipo}
              velocidad={personajeSeleccionado.velocidad}
              salud={personajeSeleccionado.salud}
              energia={personajeSeleccionado.energia}
              foto={personajeSeleccionado.foto}
            />
            <div className={styles.modalButtons}>
              <Button text="Cancelar" onClick={cancelar} />
              <Button text="Elegir" onClick={handleElegir} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
