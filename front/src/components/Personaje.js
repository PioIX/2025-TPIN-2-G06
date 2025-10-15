"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Personaje.module.css";

export default function Personaje(props) {
  const [saludActual, setSaludActual] = useState(props.saludActual);
  const [energiaActual, setEnergiaActual] = useState(props.energiaActual);

  const porcentajeVida = (saludActual / props.saludMax) * 100;
  const porcentajeEnergia = (energiaActual / props.energiaMax) * 100;

  return (
    <div className={`${styles.personajeCard} ${props.className}`}>
      <img src={props.imagen} alt={props.nombre} className={styles.personajeImagen} />
      <h2 className={styles.personajeNombre}>{props.nombre}</h2>

      <div className={styles.vidaContainer}>
        <div
          className={clsx(styles.vidaBarra, {
            [styles.vidaAlta]: porcentajeVida > 60,
            [styles.vidaMedia]: porcentajeVida <= 60 && porcentajeVida > 30,
            [styles.vidaBaja]: porcentajeVida <= 30,
          })}
          style={{ width: `${porcentajeVida}%` }}
        />
      </div>

      <p className={styles.vidaTexto}>
        {saludActual} / {props.saludMax} HP
      </p>

      <div className={styles.vidaContainer}>
        <div
          className={clsx(styles.vidaBarra, {
            [styles.energuia]: true
          })}
          style={{ width: `${porcentajeEnergia}%` }}
        />
      </div>

      <p className={styles.vidaTexto}>
        {energiaActual} / {props.energiaMax} ✨
      </p>
    </div>

  );
}
