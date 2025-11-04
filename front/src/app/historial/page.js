"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/historial/historial.module.css";

export default function HistorialPartidas() {
  const searchParams = useSearchParams();
  const [partidas, setPartidas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("idUsuario");
    if (id) {
      setIdUsuario(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (idUsuario) {
      obtenerHistorial(idUsuario);
    }
  }, [idUsuario]);

  async function obtenerHistorial(idUsuario) {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/obtenerHistorial?idUsuario=${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener historial");
      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error("Error al obtener el historial de partidas:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className={styles.loading}>Cargando historial...</p>;
  }

  return (
    <div className={styles.historialWrapper}>
      <h1 className={styles.title}>Historial de Partidas</h1>
      {partidas.length === 0 ? (
        <p className={styles.noData}>No se encontraron partidas jugadas.</p>
      ) : (
        <table className={styles.historialTable}>
          <thead>
            <tr>
              <th>Contrincante</th>
              <th>Resultado</th>
              <th>Personaje Ganador</th>
              <th>Personaje Perdedor</th>
            </tr>
          </thead>
          <tbody>
            {partidas.map((p, index) => (
              <tr
                key={index}
                className={
                  p.resultado === "Victoria" ? styles.victoria : p.resultado === "Derrota" ? styles.derrota : ""
                }
              >
                <td>{p.contrincante}</td>
                <td>{p.resultado}</td>
                <td>
                  <div className={styles.personajeContainer}>
                    <span>{p.personajeGanador}</span>
                    <img src={p.fotoPersonajeGanador} alt="Personaje Ganador" className={styles.personajeImg} />
                  </div>
                </td>
                <td>
                  <div className={styles.personajeContainer}>
                    <span>{p.personajePerdedor}</span>
                    <img src={p.fotoPersonajePerdedor} alt="Personaje Perdedor" className={styles.personajeImg} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
