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
      console.log("Respuesta del servidor:", response);
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
    return <p>Cargando historial...</p>;
  }

  return (
    <div className={styles.historialWrapper}>
      <h1>Historial de Partidas</h1>
      {partidas.length === 0 ? (
        <p>No se encontraron partidas jugadas.</p>
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
              <tr key={index}>
                <td>{p.contrincante}</td>
                <td>{p.resultado}</td>
                <td>{p.personajeGanador}</td>
                <td>{p.personajePerdedor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
