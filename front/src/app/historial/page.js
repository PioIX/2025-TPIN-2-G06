"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/historial/historial.module.css"; // CSS Module

export default function HistorialPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerHistorial();
  }, []);

  async function obtenerHistorial() {
    try {
      const response = await fetch("http://localhost:4000/obtenerHistorial");
      const data = await response.json();

      // Ordenar partidas de más reciente a más antigua
      const partidasOrdenadas = data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setPartidas(partidasOrdenadas);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el historial de partidas:", error);
      setLoading(false);
    }
  }

  return (
    <div className={styles.historialWrapper}>
      <h1>Historial de Partidas</h1>

      {loading ? (
        <p>Cargando partidas...</p>
      ) : partidas.length === 0 ? (
        <p>No hay partidas registradas.</p>
      ) : (
        <table className={styles.historialTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador 1</th>
              <th>Jugador 2</th>
              <th>Ganador</th>
              <th>Fecha</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            {partidas.map((p, index) => (
              <tr key={p.idPartida}>
                <td>{index + 1}</td>
                <td>{p.jugador1}</td>
                <td>{p.jugador2}</td>
                <td
                  className={
                    p.ganador === p.jugador1
                      ? styles.winJugador1
                      : styles.winJugador2
                  }
                >
                  {p.ganador}
                </td>
                <td>{new Date(p.fecha).toLocaleString()}</td>
                <td>{p.duracion || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
