"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/historial/historial.module.css"; // CSS Module

export default function HistorialPartidas() {
  const searchParams = useSearchParams();
  const [partidas, setPartidas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const id = searchParams.get("idUsuario");
    setIdUsuario(id);
    obtenerHistorial(idUsuario);
  }, [searchParams]);

  async function obtenerHistorial(idUsuario) {
    try {
      const response = await fetch(`http://localhost:4000/obtenerHistorial?idUsuario=${idUsuario}`);
      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error("Error al obtener el historial de partidas:", error);
    }
  }

  return (
    <div className={styles.historialWrapper}>
      <h1>Historial de Partidas</h1>
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
              <tr key={index}>
                <td>{p.contrincante1} vs {p.contrincante2}</td>
                <td>{p.resultado}</td>
                <td>{p.personajeGanador}</td>
                <td>{p.personajePerdedor}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
