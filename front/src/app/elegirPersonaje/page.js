"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import PersonajeLuqui from "@/components/PersonajeLuqui";
import CardPersonaje from "@/components/CardPersonaje";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useIp } from "@/hooks/useIp"; // Importar el hook useIp
import styles from "./elegirPersonaje.module.css";

export default function ElegirPersonaje() {
  const [personajes, setPersonajes] = useState([]);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);  // Estado de carga para personajes
  const router = useRouter();
  const searchParams = useSearchParams();
  const idUsuario = searchParams.get("idUsuario");

  // Obtener IP dinámica
  const { ip } = useIp(); 

  useEffect(() => {
    const obtenerPersonajes = async () => {
      try {
        if (!ip) return; // Verificar que la IP esté disponible antes de hacer la solicitud
        const response = await fetch(`http://${ip}:4000/obtenerPersonajes`);
        const data = await response.json();
        setPersonajes(data);
      } catch (error) {
        console.error("Error al obtener personajes:", error);
      } finally {
        setLoading(false);  // Desactivar el estado de carga
      }
    };

    obtenerPersonajes();
  }, [ip]);  // Ejecutar el efecto cada vez que la IP cambie

  const elegirPersonaje = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setMostrarModal(true);
  };

  const cancelarSeleccion = () => {
    setMostrarModal(false);
    setPersonajeSeleccionado(null);
  };

  const manejarElegir = () => {
    router.push(`/crearPartida?idUsuario=${idUsuario}&personaje=${personajeSeleccionado.idPersonaje}`);
  };

  function volverAlMenu() {
    router.push(`/menuGeneral?idUsuario=${idUsuario}`);
  }

  if (loading) {
    return <div className={styles.loading}>Cargando personajes...</div>;
  }

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
