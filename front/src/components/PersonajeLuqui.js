"use client"
import styles from './PersonajeLuqui.module.css';

export default function PersonajeLuqui(props) {
    return (
      <>
      <div className = {styles.p}>
        <h3> Nombre = {props.nombre}</h3>
        <p> Tipo = {props.tipo}</p>
        <p> Velocidad = {props.velocidad}</p>
        <p> Salud = {props.salud}</p>
        <p> Energía = {props.energia}</p>
        <p> Foto = {props.foto}</p>
      </div>
      </>
    );
  }
  