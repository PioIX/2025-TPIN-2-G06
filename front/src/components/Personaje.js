"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Personaje.module.css";

export default function Personaje(props) {
  const [saludActual, setSaludActual] = useState(props.saludActual);
  const [energuiaActual, setEnerguiaActual] = useState(props.energuiaActual);

  useEffect(() => {
    setSaludActual(props.saludActual);
  }, [props.saludActual]);

  useEffect(() => {
    setEnerguiaActual(props.energuiaActual);
  }, [props.energuiaActual]);

  const porcentajeVida = (saludActual / props.saludMax) * 100;
  const porcentajeEnerguia = (saludActual / props.saludMax) * 100;

  return (
    <div className={styles.personajeCard}>
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
    </div>
  );
}
