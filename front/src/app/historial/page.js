"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/historial/historial.module.css";

export default function HistorialPartidas() {
  const searchParams = useSearchParams();
  const [partidas, setPartidas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

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

  const filtrarPartidas = (partidas, filtro) => {
    if (filtro === "Victoria") {
      return partidas.filter(p => p.resultado === "Victoria");
    } else if (filtro === "Derrota") {
      return partidas.filter(p => p.resultado === "Derrota");
    }
    return partidas;
  };

  if (loading) {
    return <p className={styles.loading}>Cargando historial...</p>;
  }

  return (
    <div className={styles.historialWrapper}>
      <h1 className={styles.title}>Historial de Partidas</h1>

      {/* Filtros */}
      <div className={styles.filters}>
        <button className={filtro === "Todos" ? styles.activeFilter : ""} onClick={() => setFiltro("Todos")}>Todos</button>
        <button className={filtro === "Victoria" ? styles.activeFilter : ""} onClick={() => setFiltro("Victoria")}>Victorias</button>
        <button className={filtro === "Derrota" ? styles.activeFilter : ""} onClick={() => setFiltro("Derrota")}>Derrotas</button>
      </div>

      {partidas.length === 0 ? (
        <p className={styles.noData}>No se encontraron partidas jugadas.</p>
      ) : (
        <table className={styles.historialTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Contrincante</th>
              <th>Resultado</th>
              <th>Personaje Ganador</th>
              <th>Personaje Perdedor</th>
            </tr>
          </thead>
          <tbody>
            {filtrarPartidas(partidas, filtro).map((p, index) => (
              <tr
                key={index}
                className={
                  p.resultado === "Victoria" ? styles.victoria : p.resultado === "Derrota" ? styles.derrota : ""
                }
              >
                <td>{index + 1}</td>
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
