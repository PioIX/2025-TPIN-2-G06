"use client";
import React from "react";
import styles from "./CardPersonaje.module.css";

export default function CardPersonaje(props) {
  return (
    <div className={styles.card} onClick={props.onClick}>
      <div className={styles.imageWrapper}>
        <img src={props.foto} alt={props.nombre} className={styles.image} />
      </div>
     
      <h3 className={styles.name}>{props.nombre}</h3>
    </div>
  );
}