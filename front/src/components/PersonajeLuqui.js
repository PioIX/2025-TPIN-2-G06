"use client"

export default function PersonajeLuqui(props) {
    return (
      <>
        <h3> Nombre = {props.nombre}</h3>
        <p> Tipo = {props.tipo}</p>
        <p> Velocidad = {props.velocidad}</p>
        <p> Salud = {props.salud}</p>
        <p> Energía = {props.energia}</p>
        <img> Foto = {props.foto}</img>
      </>
    );
  }
  