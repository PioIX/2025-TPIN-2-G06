"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import PersonajeLuqui from "@/components/PersonajeLuqui";
import CardPersonaje from "@/components/CardPersonaje";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import styles from "./elegirPersonaje.module.css";

export default function ElegirPersonaje() {
  const [personajes, setPersonajes] = useState([]);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idUsuario = searchParams.get("idUsuario");

  useEffect(() => {
    const obtenerPersonajes = async () => {
      try {
        const response = await fetch("http://localhost:4000/obtenerPersonajes");
        const data = await response.json();
        setPersonajes(data);
      } catch (error) {
        console.error("Error al obtener personajes:", error);
      }
    };
    
    obtenerPersonajes();
  }, []);

  const elegirPersonaje = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setMostrarModal(true);
  };

  const cancelarSeleccion = () => {
    setMostrarModal(false);
    setPersonajeSeleccionado(null);
  };
  
  function volverAlMenu() {
    router.push(`/menuGeneral?idUsuario=${idUsuario}`);
  }

  const manejarElegir = () => {
    router.push(`/crearPartida?idUsuario=${idUsuario}&personaje=${personajeSeleccionado.idPersonaje}`);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.titulo}>Selecciona tu personaje</h1>

      <div className={styles.gridPersonajes}>
        {personajes.map((personaje) => (
          <CardPersonaje
            key={personaje.idPersonaje}
            nombre={personaje.nombre}
            foto={personaje.fotoPersonaje}
            onClick={() => elegirPersonaje(personaje)}
          />
        ))}
      </div>
      <div className={styles.volverMenuGeneral}>
        <Button text="Volver" onClick={volverAlMenu} />
      </div>

      {mostrarModal && personajeSeleccionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <PersonajeLuqui {...personajeSeleccionado} />
            <div className={styles.modalButtons}>
              <Button text="Cancelar" onClick={cancelarSeleccion} />
              <Button text="Elegir" onClick={manejarElegir} />
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
