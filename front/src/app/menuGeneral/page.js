"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import styles from "./menuGeneral.module.css";

export default function MenuGeneral() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [idUsuario, setIdUsuario] = useState(null);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const id = searchParams.get("idUsuario");
    const nombreUsuario = searchParams.get("nombre");
    setIdUsuario(id);
    if (nombreUsuario) setNombre(nombreUsuario);
  }, [searchParams]);

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <div className={styles.menuGeneralWrapper}>
      <div className={styles.menuGeneralLogo}>🤼</div>
      <h1 className={styles.menuGeneralTitle}>Kombat Pio</h1>
      <h2 className={styles.menuGeneralSubtitle}>
        {nombre ? `¡Bienvenido, ${nombre}!` : "Seleccione una opción:"}
      </h2>

      <div className={styles.menuGeneralButtons}>
        <button
          className={styles.menuGeneralBtn}
          onClick={() => router.push("/ranking")}
        >
          Ver Ranking
        </button>
        <button
          className={styles.menuGeneralBtn}
          onClick={() => router.push(`/historial?idUsuario=${idUsuario}`)}
        >
          Ver Historial de Partidas
        </button>
        <button
          className={styles.menuGeneralBtn}
          onClick={() => router.push(`/elegirPersonaje?idUsuario=${idUsuario}`)}
        >
          Jugar
        </button>
      </div>

      <div className={styles.menuGeneralLogout}>
        <Button text="Cerrar Sesión" onClick={handleLogout} />
      </div>
    </div>
  );
}
