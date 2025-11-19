"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/ranking/ranking.module.css";  // Importar el CSS Module
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useIp } from "@/hooks/useIp";  // Importamos el hook useIp

export default function Ranking() {
  const [jugadores, setJugadores] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const idUsuario = searchParams.get("idUsuario");

  // Llamamos al hook useIp para obtener la IP
  const { ip } = useIp();  // Ahora obtenemos la IP desde el hook

  useEffect(() => {
    if (ip) {
      obtenerJugadores();  // Solo realizar la solicitud si la IP está definida
    } else {
      console.error("IP no definida.");
    }
  }, [ip]);

  async function obtenerJugadores() {
    try {
      const response = await fetch(`http://${ip}:4000/obtenerPartidas`);  // Usamos la IP dinámica aquí
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
