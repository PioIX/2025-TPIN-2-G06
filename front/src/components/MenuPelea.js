"use client";
import { useState } from "react";
import Button from "@/components/Button";
import clsx from "clsx";
import styles from "./MenuPelea.module.css";

export default function MenuPelea(props) {
  const [menu, setMenu] = useState("inicio");
  const [ataqueSeleccionado, setAtaqueSeleccionado] = useState(false);

  const mostrarMenuAtaque = () => {
    setMenu("ataque");
    setAtaqueSeleccionado(true);
  };

  const mostrarMenuDefensa = () => alert("Defender activado");

  const volverAlInicio = () => {
    setMenu("inicio");
    setAtaqueSeleccionado(false);
  };

  const mitad = Math.ceil(props.ataques.length / 2);

  return (
    <div className={styles.contenedor}>
      {/* MENU INICIO */}
      {menu === "inicio" && (
        <div className={clsx(styles.menuInicio)}>
          <div className={styles.columnaTexto}>
            <h2 className={styles.titulo}>¿Qué vas a hacer?</h2>
            <p className={styles.subtitulo}>
              {props.probabilidadEsquivar}% de probabilidad de esquivar el próximo ataque
            </p>
          </div>
          <div className={styles.columnaBotones}>
            <Button onClick={mostrarMenuAtaque} text="Atacar" />
            <Button onClick={mostrarMenuDefensa} text="Defender" />
          </div>
        </div>
      )}

      {/* MENU ATAQUE */}
      {menu === "ataque" && (
        <div
          className={clsx(styles.menuAtaque, {
            [styles.menuAtaqueActivo]: ataqueSeleccionado,
          })}
        >
          <div className={styles.columnaTexto}>
            <h2 className={styles.titulo}>Selecciona un ataque:</h2>
            <p className={styles.subtitulo}>
              Selecciona una habilidad ofensiva para atacar al enemigo
            </p>
          </div>

          <div className={styles.columnaBotones}>
            {props.ataques.map((ataque, i) => (
              <Button key={i} text={ataque.nombre} />
            ))}
          </div>

          <div className={styles.columnaBotones}>
            <Button onClick={volverAlInicio} text="Volver" />
          </div>
        </div>
      )}
    </div>
  );
}
