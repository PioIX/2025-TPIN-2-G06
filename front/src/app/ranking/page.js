"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/ranking/ranking.module.css";  // Importar el CSS Module
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";

export default function Ranking() {
  const [jugadores, setJugadores] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    obtenerJugadores();
    const idUsuario = searchParams.get("idUsuario");
  }, []);

  async function obtenerJugadores() {
    try {
      const response = await fetch("http://localhost:4000/obtenerPartidas");
      const data = await response.json();

      // Calcular total de partidas y winrate
      const jugadoresConStats = data.map(jugador => {
        const total = jugador.victorias + jugador.derrotas;
        const winRate = total > 0 ? (jugador.victorias / total) * 100 : 0;
        return { ...jugador, total, winRate };
      });

      // Ordenar por winrate descendente y tomar los 10 mejores
      const rankingTop10 = jugadoresConStats
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 10);

      setJugadores(rankingTop10);
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
    }
  }

  function volverAlMenu() {
    router.push(`/menuGeneral?idUsuario=${idUsuario}`);
  }
  return (
    <>
      <div className={styles.rankingWrapper}>
        <h1>Ranking Top 10 Jugadores</h1>
        <table className={styles.rankingTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Victorias</th>
              <th>Derrotas</th>
              <th>Total Partidas</th>
              <th>Win Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map(j => (
              <tr key={j.idUsuario}>
                <td>{j.nombre}</td>
                <td>{j.victorias}</td>
                <td>{j.derrotas}</td>
                <td>{j.total}</td>
                <td>{j.winRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.volverMenuGeneral}>
        <Button text="Volver" onClick={volverAlMenu} />
      </div>
    </>

  );
}
